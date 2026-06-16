import type { CollectionConfig } from 'payload'

function escapeHTML(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',

  admin: {
    useAsTitle: 'name',
    group: 'Enquiries',
    defaultColumns: ['name', 'mobile', 'product', 'status', 'createdAt'],
    listSearchableFields: ['name', 'mobile', 'email'],
  },

  // Enquiries are created via frontend API only — not from admin
  access: {
    create: () => false,
    read:   ({ req }) => Boolean(req.user),    // admin only
    update: ({ req }) => Boolean(req.user),    // admin only
    delete: ({ req }) => {
      if (!req.user) return false
      return (req.user as { role?: string }).role === 'super_admin'
    },
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        const adminEmail = process.env.ADMIN_EMAIL
        if (operation !== 'create' || !process.env.RESEND_API_KEY || !adminEmail) {
          return doc
        }

        const subject = `New website enquiry from ${doc.name}`
        const text = [
          `Name: ${doc.name}`,
          `Mobile: ${doc.mobile}`,
          `Email: ${doc.email || 'Not provided'}`,
          `Product: ${doc.product || 'General Enquiry'}`,
          `Message: ${doc.message || 'Not provided'}`,
        ].join('\n')

        try {
          await req.payload.sendEmail({
            to: adminEmail,
            replyTo: doc.email || undefined,
            subject,
            text,
            html: `
              <h2>New website enquiry</h2>
              <p><strong>Name:</strong> ${escapeHTML(doc.name)}</p>
              <p><strong>Mobile:</strong> ${escapeHTML(doc.mobile)}</p>
              <p><strong>Email:</strong> ${escapeHTML(doc.email || 'Not provided')}</p>
              <p><strong>Product:</strong> ${escapeHTML(doc.product || 'General Enquiry')}</p>
              <p><strong>Message:</strong><br>${escapeHTML(doc.message || 'Not provided').replaceAll('\n', '<br>')}</p>
            `,
          })
        } catch (error) {
          req.payload.logger.error({
            err: error,
            msg: `Failed to send enquiry notification for enquiry ${doc.id}`,
          })
        }

        return doc
      },
    ],
  },

  fields: [
    // ── READ-ONLY — captured from frontend ────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'mobile',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'email',
      type: 'email',
      admin: { readOnly: true },
    },
    {
      name: 'product',
      type: 'text',
      label: 'Product Enquired',
      admin: { readOnly: true },
    },
    {
      name: 'message',
      type: 'textarea',
      admin: { readOnly: true },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'website',
      admin: { readOnly: true },
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'referrerUrl',
      type: 'text',
      admin: { readOnly: true },
    },

    // ── EDITABLE — admin follow-up ────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: '🆕 New',       value: 'new' },
        { label: '📞 Contacted', value: 'contacted' },
        { label: '✅ Converted', value: 'converted' },
        { label: '❌ Closed',    value: 'closed' },
      ],
      admin: {
        description: 'Update this as you follow up with the customer.',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        description: 'Internal notes — not visible to the customer.',
      },
    },
    {
      name: 'contactedAt',
      type: 'date',
      label: 'Date Contacted',
      admin: {
        description: 'Date you first contacted this customer.',
      },
    },
  ],
}
