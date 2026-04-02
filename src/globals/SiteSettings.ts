import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',

  admin: {
    group: 'Settings',
  },

  fields: [
    // ── BRANDING ──────────────────────────────────────────────────────
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main website logo. Recommended: PNG with transparent background, 200×60px.',
      },
    },
    {
      name: 'logoText',
      type: 'text',
      defaultValue: 'Siva Sai Products',
      admin: {
        description: 'Text shown if no logo image is uploaded.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      admin: {
        description: 'Shown in footer. Example: Pure Products for Pure Devotion',
      },
    },

    // ── CONTACT INFO ──────────────────────────────────────────────────
    {
      name: 'phone',
      type: 'text',
      admin: { description: 'Example: +91-98765-43210' },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      label: 'WhatsApp Number',
      admin: {
        description: 'With country code, no + or spaces. Example: 919876543210',
      },
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'address',
      type: 'textarea',
      admin: { description: 'Full business address shown in footer and Contact page.' },
    },
    {
      name: 'googleMapsUrl',
      type: 'text',
      label: 'Google Maps Embed URL',
      admin: {
        description: 'Paste the Google Maps embed iframe src URL here for the Contact page map.',
      },
    },

    // ── SOCIAL LINKS ──────────────────────────────────────────────────
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook',  value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube',   value: 'youtube' },
            { label: 'Twitter',   value: 'twitter' },
            { label: 'LinkedIn',  value: 'linkedin' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          admin: { description: 'Full URL. Example: https://instagram.com/sivasaiproducts' },
        },
      ],
    },

    // ── FOOTER ────────────────────────────────────────────────────────
    {
      name: 'footerText',
      type: 'text',
      admin: {
        description: 'Copyright text. Example: © 2026 Siva Sai Products. All rights reserved.',
      },
    },

    // ── SEO DEFAULTS ──────────────────────────────────────────────────
    {
      name: 'defaultMeta',
      type: 'group',
      label: 'Default SEO (used when a page has no specific SEO set)',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Default page title.' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Default meta description.' },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Default social share image. 1200×630px.' },
        },
      ],
    },
  ],
}
