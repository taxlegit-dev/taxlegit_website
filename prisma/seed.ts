import "dotenv/config";
import { PrismaClient, Region, Role, ContentStatus, PageKey, NavbarItemType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUsers() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@taxlegit.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123";
  const adminPasswordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Taxlegit Admin",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash,
    },
  });

  const userEmail = "user@taxlegit.com";
  const userPassword = "User@123";
  const userPasswordHash = await bcrypt.hash(userPassword, 12);

  await prisma.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      email: userEmail,
      name: "Taxlegit User",
      role: Role.USER,
      passwordHash: userPasswordHash,
    },
  });
}

async function seedStaticPages() {
  const defaults = [
    {
      key: PageKey.HOME,
      title: "Taxlegit India — Compliance Simplified",
      region: Region.INDIA,
    },
    {
      key: PageKey.ABOUT,
      title: "About Taxlegit India",
      region: Region.INDIA,
    },
    {
      key: PageKey.HOME,
      title: "Taxlegit US — Compliance for Founders",
      region: Region.US,
    },
    {
      key: PageKey.ABOUT,
      title: "About Taxlegit US",
      region: Region.US,
    },
  ];

  await Promise.all(
    defaults.map((page) =>
      prisma.staticPage.upsert({
        where: {
          key_region: {
            key: page.key,
            region: page.region,
          },
        },
        update: {},
        create: {
          key: page.key,
          region: page.region,
          title: page.title,
          content: {
            type: "doc",
            content: [
              {
                type: "hero",
                attrs: {
                  eyebrow: page.region === Region.INDIA ? "India" : "United States",
                  heading: page.title,
                  subheading:
                    page.region === Region.INDIA
                      ? "Registrations, compliance and legal ops for Indian startups."
                      : "Incorporation and compliance launchpad for US-bound founders.",
                  ctaLabel: "Book a strategy call",
                },
              },
            ],
          },
          status: ContentStatus.PUBLISHED,
        },
      }),
    ),
  );
}

async function seedNavigation() {
  // Clear existing navigation items
  await prisma.navbarItem.deleteMany({});

  // INDIA Region - Mega Menu Structure
  const startBusinessIndia = await prisma.navbarItem.create({
    data: {
      label: "Start A Business",
      href: null,
      order: 0,
      type: NavbarItemType.DROPDOWN,
      region: Region.INDIA,
    },
  });

  // Company Registration Group
  const companyRegGroup = [
    { label: "Private Limited Company Registration", href: "/services/company-registration/private-limited-registration", order: 0 },
    { label: "LLP Registration", href: "/services/company-registration/llp-registration", order: 1 },
    { label: "OPC Registration", href: "/services/company-registration/opc-registration", order: 2 },
    { label: "Section 8 Registration", href: "/services/company-registration/section-8-registration", order: 3 },
    { label: "Sole Proprietorship Registration", href: "/services/company-registration/sole-proprietorship-registration", order: 4 },
  ];

  for (const item of companyRegGroup) {
    await prisma.navbarItem.create({
      data: {
        label: item.label,
        href: item.href,
        order: item.order,
        type: NavbarItemType.LINK,
        region: Region.INDIA,
        parentId: startBusinessIndia.id,
        groupLabel: "Company Registration",
      },
    });
  }

  // Compliance and Licensing Group
  const complianceGroup = [
    { label: "ISO Registration", href: "/services/compliance/iso-registration", order: 0 },
    { label: "FSSAI Registration", href: "/services/compliance/fssai-registration", order: 1 },
    { label: "ISP License Registration", href: "/services/compliance/isp-license-registration", order: 2 },
  ];

  for (const item of complianceGroup) {
    await prisma.navbarItem.create({
      data: {
        label: item.label,
        href: item.href,
        order: item.order,
        type: NavbarItemType.LINK,
        region: Region.INDIA,
        parentId: startBusinessIndia.id,
        groupLabel: "Compliance and Licensing",
      },
    });
  }

  // Other top-level items for India
  await prisma.navbarItem.create({
    data: {
      label: "Home",
      href: "/",
      order: 1,
      type: NavbarItemType.LINK,
      region: Region.INDIA,
    },
  });

  await prisma.navbarItem.create({
    data: {
      label: "Blog",
      href: "/blog",
      order: 2,
      type: NavbarItemType.LINK,
      region: Region.INDIA,
    },
  });

  await prisma.navbarItem.create({
    data: {
      label: "About",
      href: "/about",
      order: 3,
      type: NavbarItemType.LINK,
      region: Region.INDIA,
    },
  });

  await prisma.navbarItem.create({
    data: {
      label: "Login",
      href: "/login",
      order: 4,
      type: NavbarItemType.BUTTON,
      isLoginLink: true,
      region: Region.INDIA,
    },
  });

  // US Region - Mega Menu Structure
  const startBusinessUS = await prisma.navbarItem.create({
    data: {
      label: "Start A Business",
      href: null,
      order: 0,
      type: NavbarItemType.DROPDOWN,
      region: Region.US,
    },
  });

  // US Company Formation Group
  const usCompanyGroup = [
    { label: "Delaware C-Corp Formation", href: "/us/services/incorporation/delaware-c-corp", order: 0 },
    { label: "LLC Formation", href: "/us/services/incorporation/llc-formation", order: 1 },
    { label: "S-Corp Election", href: "/us/services/incorporation/s-corp-election", order: 2 },
  ];

  for (const item of usCompanyGroup) {
    await prisma.navbarItem.create({
      data: {
        label: item.label,
        href: item.href,
        order: item.order,
        type: NavbarItemType.LINK,
        region: Region.US,
        parentId: startBusinessUS.id,
        groupLabel: "Company Formation",
      },
    });
  }

  // US Compliance Group
  const usComplianceGroup = [
    { label: "EIN Registration", href: "/us/services/compliance/ein-registration", order: 0 },
    { label: "State Tax Registration", href: "/us/services/compliance/state-tax-registration", order: 1 },
    { label: "Business License", href: "/us/services/compliance/business-license", order: 2 },
  ];

  for (const item of usComplianceGroup) {
    await prisma.navbarItem.create({
      data: {
        label: item.label,
        href: item.href,
        order: item.order,
        type: NavbarItemType.LINK,
        region: Region.US,
        parentId: startBusinessUS.id,
        groupLabel: "Compliance and Licensing",
      },
    });
  }

  // Other top-level items for US
  await prisma.navbarItem.create({
    data: {
      label: "Home",
      href: "/us",
      order: 1,
      type: NavbarItemType.LINK,
      region: Region.US,
    },
  });

  await prisma.navbarItem.create({
    data: {
      label: "About",
      href: "/us/about",
      order: 2,
      type: NavbarItemType.LINK,
      region: Region.US,
    },
  });

  await prisma.navbarItem.create({
    data: {
      label: "Login",
      href: "/login",
      order: 3,
      type: NavbarItemType.BUTTON,
      isLoginLink: true,
      region: Region.US,
    },
  });
}

async function seedBlogs() {
  const posts = [
    {
      region: Region.INDIA,
      title: "How to choose the right entity in India",
      slug: "choose-right-entity-india",
      excerpt: "Pvt Ltd vs LLP vs OPC — a founder-first guide.",
    },
    {
      region: Region.US,
      title: "Incorporating in Delaware from India",
      slug: "delaware-from-india",
      excerpt: "Why YC companies still pick Delaware and how to stay compliant.",
    },
  ];

  for (const post of posts) {
    await prisma.blog.upsert({
      where: {
        slug_region: {
          slug: post.slug,
          region: post.region,
        },
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: post.excerpt,
                },
              ],
            },
          ],
        },
        status: ContentStatus.PUBLISHED,
      },
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: post.excerpt,
                },
              ],
            },
          ],
        },
        tags: [],
        region: post.region,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
      },
    });
  }
}

async function main() {
  await seedUsers();
  await seedStaticPages();
  await seedNavigation();
  await seedBlogs();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

