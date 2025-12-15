import "dotenv/config";
import {
  PrismaClient,
  Region,
  Role,
  ContentStatus,
  PageKey,
  NavbarItemType,
} from "@prisma/client";
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
                  eyebrow:
                    page.region === Region.INDIA ? "India" : "United States",
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
      })
    )
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
    {
      label: "Private Limited Company Registration",
      href: "/services/company-registration/private-limited-registration",
      order: 0,
    },
    {
      label: "LLP Registration",
      href: "/services/company-registration/llp-registration",
      order: 1,
    },
    {
      label: "OPC Registration",
      href: "/services/company-registration/opc-registration",
      order: 2,
    },
    {
      label: "Section 8 Registration",
      href: "/services/company-registration/section-8-registration",
      order: 3,
    },
    {
      label: "Sole Proprietorship Registration",
      href: "/services/company-registration/sole-proprietorship-registration",
      order: 4,
    },
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
    {
      label: "ISO Registration",
      href: "/services/compliance/iso-registration",
      order: 0,
    },
    {
      label: "FSSAI Registration",
      href: "/services/compliance/fssai-registration",
      order: 1,
    },
    {
      label: "ISP License Registration",
      href: "/services/compliance/isp-license-registration",
      order: 2,
    },
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
    {
      label: "Delaware C-Corp Formation",
      href: "/us/services/incorporation/delaware-c-corp",
      order: 0,
    },
    {
      label: "LLC Formation",
      href: "/us/services/incorporation/llc-formation",
      order: 1,
    },
    {
      label: "S-Corp Election",
      href: "/us/services/incorporation/s-corp-election",
      order: 2,
    },
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
    {
      label: "EIN Registration",
      href: "/us/services/compliance/ein-registration",
      order: 0,
    },
    {
      label: "State Tax Registration",
      href: "/us/services/compliance/state-tax-registration",
      order: 1,
    },
    {
      label: "Business License",
      href: "/us/services/compliance/business-license",
      order: 2,
    },
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

async function seedBlogGroups() {
  const indiaBlogGroups = [
    { name: "Company Registration", order: 0 },
    { name: "Tax Compliance", order: 1 },
    { name: "Business Tips", order: 2 },
  ];

  for (const group of indiaBlogGroups) {
    await prisma.blogGroup.upsert({
      where: {
        name_region: {
          name: group.name,
          region: Region.INDIA,
        },
      },
      update: {},
      create: {
        name: group.name,
        region: Region.INDIA,
        order: group.order,
      },
    });
  }
}

async function seedBlogs() {
  const blogGroups = await prisma.blogGroup.findMany({
    where: { region: Region.INDIA },
  });

  const companyRegGroup = blogGroups.find(g => g.name === "Company Registration");
  const taxComplianceGroup = blogGroups.find(g => g.name === "Tax Compliance");
  const businessTipsGroup = blogGroups.find(g => g.name === "Business Tips");

  const sampleBlogs = [
    {
      title: "Complete Guide to Private Limited Company Registration in India",
      content: "Learn everything about registering a private limited company in India, including requirements, documents, and timelines.",
      blogGroupId: companyRegGroup?.id || "",
      image: "/hero1.jpg",
    },
    {
      title: "Understanding GST Compliance for Indian Businesses",
      content: "A comprehensive guide to GST registration, filing, and compliance requirements for businesses in India.",
      blogGroupId: taxComplianceGroup?.id || "",
      image: "/hero2.jpg",
    },
    {
      title: "Top 10 Mistakes to Avoid When Starting a Business",
      content: "Common pitfalls that new entrepreneurs face and how to avoid them for a successful business launch.",
      blogGroupId: businessTipsGroup?.id || "",
      image: "/service.jpg",
    },
    {
      title: "LLP vs Private Limited Company: Which is Right for You?",
      content: "Compare the advantages and disadvantages of LLP and Pvt Ltd structures to choose the best for your business.",
      blogGroupId: companyRegGroup?.id || "",
      image: "/tax.png",
    },
    {
      title: "Digital Marketing Strategies for Small Businesses",
      content: "Effective digital marketing tips and strategies to grow your business online in the competitive market.",
      blogGroupId: businessTipsGroup?.id || "",
      image: "/review1.jpg",
    },
  ];

  for (const blog of sampleBlogs) {
    if (blog.blogGroupId) {
      await prisma.blog.create({
        data: {
          title: blog.title,
          content: blog.content,
          blogGroupId: blog.blogGroupId,
          region: Region.INDIA,
          status: ContentStatus.PUBLISHED,
          image: blog.image,
        },
      });
    }
  }
}

async function main() {
  await seedUsers();
  await seedStaticPages();
  await seedNavigation();
  await seedBlogGroups();
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
