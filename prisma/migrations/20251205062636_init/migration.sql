-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('INDIA', 'US');

-- CreateEnum
CREATE TYPE "NavbarItemType" AS ENUM ('LINK', 'DROPDOWN', 'BUTTON');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PageKey" AS ENUM ('HOME', 'ABOUT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "contact" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "region" "Region",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "NavbarItem" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "type" "NavbarItemType" NOT NULL DEFAULT 'LINK',
    "isLoginLink" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "parentId" TEXT,
    "groupLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavbarItem_pkey" PRIMARY KEY ("id")
);


-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PageHero" (
    "id" TEXT NOT NULL,
    "navbarItemId" TEXT NOT NULL,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "content" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageHero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePage" (
    "id" TEXT NOT NULL,
    "navbarItemId" TEXT NOT NULL,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePageSection" (
    "id" TEXT NOT NULL,
    "servicePageId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePageSection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE INDEX "NavbarItem_region_parentId_order_idx" ON "NavbarItem"("region", "parentId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "NavbarItem_region_label_unique" ON "NavbarItem"("region", "label");

-- CreateIndex

-- CreateIndex

-- CreateIndex
CREATE UNIQUE INDEX "StaticPage_key_region_key" ON "StaticPage"("key", "region");

-- CreateIndex
CREATE UNIQUE INDEX "PageHero_navbarItemId_key" ON "PageHero"("navbarItemId");

-- CreateIndex
CREATE INDEX "PageHero_region_status_idx" ON "PageHero"("region", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PageHero_navbarItemId_region_key" ON "PageHero"("navbarItemId", "region");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePage_navbarItemId_key" ON "ServicePage"("navbarItemId");

-- CreateIndex
CREATE INDEX "ServicePage_region_status_idx" ON "ServicePage"("region", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePage_navbarItemId_region_key" ON "ServicePage"("navbarItemId", "region");

-- CreateIndex
CREATE INDEX "ServicePageSection_servicePageId_order_idx" ON "ServicePageSection"("servicePageId", "order");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NavbarItem" ADD CONSTRAINT "NavbarItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavbarItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePageSection" ADD CONSTRAINT "ServicePageSection_servicePageId_fkey" FOREIGN KEY ("servicePageId") REFERENCES "ServicePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
