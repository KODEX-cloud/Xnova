-- NOVA Marketplace -- Sprint 09 Migration
-- Date: 2026-06-27
-- Apply with: npx prisma migrate deploy (or run manually on Supabase SQL editor)

-- ============================================================
-- 1. NEW COLUMNS ON User
-- ============================================================
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "company" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "address" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isVerified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "facebook" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "instagram" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "twitter" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "linkedin" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "whatsapp" TEXT;

-- ============================================================
-- 2. NEW COLUMNS ON Lead (CRM pipeline)
-- ============================================================
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "pipelineStatus" TEXT NOT NULL DEFAULT 'NOUVEAU';
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "priority" TEXT NOT NULL DEFAULT 'MEDIUM';
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "expectedValue" DOUBLE PRECISION;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "assignedToId" TEXT;
ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();

-- Foreign key for assignedToId
ALTER TABLE "Lead"
  DROP CONSTRAINT IF EXISTS "Lead_assignedToId_fkey";
ALTER TABLE "Lead"
  ADD CONSTRAINT "Lead_assignedToId_fkey"
  FOREIGN KEY ("assignedToId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================================
-- 3. NEW TABLE: Favorite
-- ============================================================
CREATE TABLE IF NOT EXISTS "Favorite" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "type"      TEXT NOT NULL,
  "itemId"    TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Favorite_userId_type_itemId_key" UNIQUE ("userId", "type", "itemId"),
  CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 4. NEW TABLE: Notification
-- ============================================================
CREATE TABLE IF NOT EXISTS "Notification" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "type"      TEXT NOT NULL,
  "title"     TEXT NOT NULL,
  "body"      TEXT,
  "link"      TEXT,
  "isRead"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 5. NEW TABLE: Message
-- ============================================================
CREATE TABLE IF NOT EXISTS "Message" (
  "id"         TEXT NOT NULL,
  "senderId"   TEXT NOT NULL,
  "receiverId" TEXT NOT NULL,
  "subject"    TEXT,
  "body"       TEXT NOT NULL,
  "attachment" TEXT,
  "isRead"     BOOLEAN NOT NULL DEFAULT false,
  "threadId"   TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Message_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 6. NEW TABLE: Invoice
-- ============================================================
CREATE TABLE IF NOT EXISTS "Invoice" (
  "id"          TEXT NOT NULL,
  "number"      TEXT NOT NULL,
  "userId"      TEXT NOT NULL,
  "paymentId"   TEXT,
  "amount"      DOUBLE PRECISION NOT NULL,
  "tax"         DOUBLE PRECISION NOT NULL DEFAULT 0,
  "total"       DOUBLE PRECISION NOT NULL,
  "currency"    TEXT NOT NULL DEFAULT 'FCFA',
  "status"      TEXT NOT NULL DEFAULT 'PAID',
  "description" TEXT,
  "pdfUrl"      TEXT,
  "issuedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "dueAt"       TIMESTAMP(3),
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Invoice_number_key" UNIQUE ("number"),
  CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId")
    REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ============================================================
-- 7. NEW TABLE: PromoCode
-- ============================================================
CREATE TABLE IF NOT EXISTS "PromoCode" (
  "id"            TEXT NOT NULL,
  "code"          TEXT NOT NULL,
  "description"   TEXT,
  "discountType"  TEXT NOT NULL DEFAULT 'PERCENT',
  "discountValue" DOUBLE PRECISION NOT NULL,
  "maxUses"       INTEGER,
  "usedCount"     INTEGER NOT NULL DEFAULT 0,
  "minAmount"     DOUBLE PRECISION,
  "validFrom"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "validUntil"    TIMESTAMP(3),
  "isActive"      BOOLEAN NOT NULL DEFAULT true,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT NOW(),

  CONSTRAINT "PromoCode_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PromoCode_code_key" UNIQUE ("code")
);

-- ============================================================
-- 8. INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS "Notification_userId_idx" ON "Notification"("userId");
CREATE INDEX IF NOT EXISTS "Message_senderId_idx" ON "Message"("senderId");
CREATE INDEX IF NOT EXISTS "Message_receiverId_idx" ON "Message"("receiverId");
CREATE INDEX IF NOT EXISTS "Message_threadId_idx" ON "Message"("threadId");
CREATE INDEX IF NOT EXISTS "Favorite_userId_idx" ON "Favorite"("userId");
CREATE INDEX IF NOT EXISTS "Invoice_userId_idx" ON "Invoice"("userId");
