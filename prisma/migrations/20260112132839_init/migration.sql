-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "Region" AS ENUM ('INDIA', 'US');

-- CreateEnum
CREATE TYPE "NavbarItemType" AS ENUM ('LINK', 'DROPDOWN');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PageKey" AS ENUM ('HOME', 'ABOUT');

-- CreateEnum
CREATE TYPE "NavbarPageType" AS ENUM ('SERVICE', 'GENERIC');

-- CreateEnum
CREATE TYPE "MetaPageType" AS ENUM ('SERVICE', 'BLOG', 'GENERIC');

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
    "pageType" "NavbarPageType" NOT NULL DEFAULT 'GENERIC',
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

-- CreateTable
CREATE TABLE "ServicePageFAQ" (
    "id" TEXT NOT NULL,
    "navbarItemId" TEXT NOT NULL,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePageFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicePageFAQItem" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePageFAQItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogAuthor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT,
    "description" TEXT,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "content" TEXT NOT NULL,
    "blogGroupId" TEXT NOT NULL,
    "authorId" TEXT,
    "readTime" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaticPage" (
    "id" TEXT NOT NULL,
    "key" "PageKey" NOT NULL,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StaticPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaData" (
    "id" TEXT NOT NULL,
    "pageType" "MetaPageType" NOT NULL,
    "pageId" TEXT NOT NULL,
    "metaBlock" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MetaData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GenericPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT,
    "region" "Region" NOT NULL DEFAULT 'INDIA',
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GenericPage_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "ServicePageFAQ_navbarItemId_key" ON "ServicePageFAQ"("navbarItemId");

-- CreateIndex
CREATE INDEX "ServicePageFAQ_region_status_idx" ON "ServicePageFAQ"("region", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePageFAQ_navbarItemId_region_key" ON "ServicePageFAQ"("navbarItemId", "region");

-- CreateIndex
CREATE INDEX "ServicePageFAQItem_faqId_order_idx" ON "ServicePageFAQItem"("faqId", "order");

-- CreateIndex
CREATE INDEX "BlogGroup_region_order_idx" ON "BlogGroup"("region", "order");

-- CreateIndex
CREATE UNIQUE INDEX "BlogGroup_name_region_unique" ON "BlogGroup"("name", "region");

-- CreateIndex
CREATE INDEX "BlogAuthor_region_idx" ON "BlogAuthor"("region");

-- CreateIndex
CREATE INDEX "Blog_region_status_idx" ON "Blog"("region", "status");

-- CreateIndex
CREATE INDEX "Blog_blogGroupId_idx" ON "Blog"("blogGroupId");

-- CreateIndex
CREATE INDEX "Blog_authorId_idx" ON "Blog"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Blog_slug_region_key" ON "Blog"("slug", "region");

-- CreateIndex
CREATE INDEX "StaticPage_region_key_idx" ON "StaticPage"("region", "key");

-- CreateIndex
CREATE UNIQUE INDEX "StaticPage_key_region_unique" ON "StaticPage"("key", "region");

-- CreateIndex
CREATE INDEX "MetaData_pageType_pageId_idx" ON "MetaData"("pageType", "pageId");

-- CreateIndex
CREATE UNIQUE INDEX "MetaData_pageType_pageId_key" ON "MetaData"("pageType", "pageId");

-- CreateIndex
CREATE INDEX "GenericPage_region_status_idx" ON "GenericPage"("region", "status");

-- CreateIndex
CREATE UNIQUE INDEX "GenericPage_slug_region_key" ON "GenericPage"("slug", "region");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NavbarItem" ADD CONSTRAINT "NavbarItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "NavbarItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PageHero" ADD CONSTRAINT "PageHero_navbarItemId_fkey" FOREIGN KEY ("navbarItemId") REFERENCES "NavbarItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePage" ADD CONSTRAINT "ServicePage_navbarItemId_fkey" FOREIGN KEY ("navbarItemId") REFERENCES "NavbarItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePageSection" ADD CONSTRAINT "ServicePageSection_servicePageId_fkey" FOREIGN KEY ("servicePageId") REFERENCES "ServicePage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicePageFAQItem" ADD CONSTRAINT "ServicePageFAQItem_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "ServicePageFAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BlogAuthor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_blogGroupId_fkey" FOREIGN KEY ("blogGroupId") REFERENCES "BlogGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
