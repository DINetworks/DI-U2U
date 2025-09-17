export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Decentrailize Interoperability",
  description: "Gasless transactions and Programmable Cross chain Bridge",
  navItems: [
    {
      label: "Gasless",
      href: "/metatx",
    },
    {
      label: "Bridge",
      href: "/bridge",
    },
  ],
  navMenuItems: [
    {
      label: "Gasless",
      href: "/metatx",
    },
    {
      label: "Bridge",
      href: "/bridge",
    },
  ],
  links: {
    github: "https://github.com/doma-auction",
    twitter: "https://twitter.com/domaauction",
    docs: "https://docs.domaauction.com",
    discord: "https://discord.gg/domaauction",
    sponsor: "https://github.com/sponsors/domaauction",
  },
};
