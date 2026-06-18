/* eslint-disable @typescript-eslint/no-unused-vars */

const NEXT_API_URL_PROPERTY = "NEXT_API_URL";
const APP_SCRIPT_SECRET_PROPERTY = "APP_SCRIPT_SECRET";
const GMAIL_QUERY_PROPERTY = "ZID_GMAIL_QUERY";
const PROCESSED_LABEL_NAME = "ZID_PROCESSED";
const DEFAULT_GMAIL_QUERY = "newer_than:7d -label:ZID_PROCESSED";
const MAX_THREADS_PER_RUN = 20;
const REQUEST_TIMEOUT_LOCK_MS = 10000;

function syncZidOrdersToSheet() {
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(REQUEST_TIMEOUT_LOCK_MS)) {
    Logger.log("Skipped: another sync is already running.");
    return;
  }

  try {
    syncZidOrders_();
  } finally {
    lock.releaseLock();
  }
}

function processZidOrderEmails() {
  syncZidOrdersToSheet();
}

function syncZidOrders_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  ensureHeaderRow_(sheet);

  const scriptProperties = PropertiesService.getScriptProperties();
  const nextApiUrl = normalizeNextApiUrl_(
    scriptProperties.getProperty(NEXT_API_URL_PROPERTY),
  );
  const secret = scriptProperties.getProperty(APP_SCRIPT_SECRET_PROPERTY);
  const query =
    scriptProperties.getProperty(GMAIL_QUERY_PROPERTY) || DEFAULT_GMAIL_QUERY;

  if (!nextApiUrl || !secret) {
    throw new Error("Set NEXT_API_URL and APP_SCRIPT_SECRET in Script Properties.");
  }

  Logger.log("Search query: " + query);

  const processedLabel = getOrCreateLabel_(PROCESSED_LABEL_NAME);
  const threads = GmailApp.search(query, 0, MAX_THREADS_PER_RUN);

  Logger.log("Threads found: " + threads.length);

  threads.forEach(function (thread) {
    const messages = thread.getMessages();
    let threadHasSuccessfulOrder = false;

    Logger.log("Messages in thread: " + messages.length);

    messages.forEach(function (message) {
      const subject = message.getSubject();
      const body = message.getPlainBody();
      const messageId = message.getId();
      const from = message.getFrom();

      Logger.log("-------------------------");
      Logger.log("From: " + from);
      Logger.log("Subject: " + subject);
      Logger.log("Message ID: " + messageId);

      if (!isZidEmail_(from, subject, body)) {
        Logger.log("Skipped: not Zid email");
        return;
      }

      const orderId = extractOrderId_(subject + "\n" + body);

      Logger.log("Extracted order ID: " + orderId);

      if (!orderId) {
        Logger.log("Skipped: no order ID found");
        return;
      }

      const result = sendOrderToNextApi_(nextApiUrl, secret, {
        order_id: orderId,
        gmail_message_id: messageId,
        email_subject: subject,
        from: from,
      });

      if (!result.success) {
        Logger.log(
          "API failed for order " +
            orderId +
            ": " +
            result.statusCode +
            " " +
            result.body,
        );
        appendAuditRow_(sheet, orderId, messageId, subject, from, "API_FAILED");
        return;
      }

      if (!isMessageAlreadySaved_(sheet, messageId)) {
        appendAuditRow_(sheet, orderId, messageId, subject, from, "SAVED");
      }

      threadHasSuccessfulOrder = true;
      Logger.log("Saved order ID: " + orderId);
    });

    if (threadHasSuccessfulOrder) {
      thread.addLabel(processedLabel);
      Logger.log("Marked thread as processed");
    }
  });
}

function sendOrderToNextApi_(nextApiUrl, secret, payload) {
  const url = nextApiUrl + "/api/internal/zid-order-email";
  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: {
      "X-App-Script-Secret": secret,
    },
    payload: JSON.stringify(payload),
  });

  const statusCode = response.getResponseCode();
  const body = response.getContentText();

  return {
    success: statusCode >= 200 && statusCode < 300,
    statusCode: statusCode,
    body: body,
  };
}

function isZidEmail_(from, subject, body) {
  const text = [from, subject, body].join("\n").toLowerCase();

  return (
    text.includes("zid") ||
    text.includes("\u0632\u062f") ||
    text.includes("\u0637\u0644\u0628") ||
    text.includes("order")
  );
}

function extractOrderId_(text) {
  const cleanText = String(text).replace(/\s+/g, " ");
  const patterns = [
    /#\s*([0-9A-Za-z-]{3,64})/,
    /order\s*id\s*[:#-]?\s*([0-9A-Za-z-]{3,64})/i,
    /order\s*number\s*[:#-]?\s*([0-9A-Za-z-]{3,64})/i,
    /order\s*#?\s*([0-9A-Za-z-]{3,64})/i,
    /\u0637\u0644\u0628\s*\u0631\u0642\u0645\s*[:#-]?\s*([0-9A-Za-z-]{3,64})/i,
    /\u0631\u0642\u0645\s*\u0627\u0644\u0637\u0644\u0628\s*[:#-]?\s*([0-9A-Za-z-]{3,64})/i,
    /\b([0-9]{4,})\b/,
  ];

  for (let i = 0; i < patterns.length; i += 1) {
    const match = cleanText.match(patterns[i]);

    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

function ensureHeaderRow_(sheet) {
  if (sheet.getLastRow() > 0) {
    return;
  }

  sheet.appendRow([
    "order_id",
    "gmail_message_id",
    "email_subject",
    "from",
    "synced_at",
    "status",
  ]);
}

function appendAuditRow_(sheet, orderId, messageId, subject, from, status) {
  sheet.appendRow([orderId, messageId, subject, from, new Date(), status]);
}

function isMessageAlreadySaved_(sheet, messageId) {
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return false;
  }

  const messageIds = sheet.getRange(2, 2, lastRow - 1, 1).getValues();

  for (let i = 0; i < messageIds.length; i += 1) {
    if (String(messageIds[i][0]) === String(messageId)) {
      return true;
    }
  }

  return false;
}

function normalizeNextApiUrl_(nextApiUrl) {
  if (!nextApiUrl) {
    return "";
  }

  const trimmedUrl = String(nextApiUrl).trim().replace(/\/+$/, "");

  if (!/^https:\/\//i.test(trimmedUrl)) {
    throw new Error("NEXT_API_URL must start with https://");
  }

  return trimmedUrl;
}

function getOrCreateLabel_(labelName) {
  return GmailApp.getUserLabelByName(labelName) || GmailApp.createLabel(labelName);
}
