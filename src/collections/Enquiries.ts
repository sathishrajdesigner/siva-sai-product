import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    group: 'Leads',
    useAsTitle: 'name',
    defaultColumns: ['name', 'mobile', 'product', 'status', 'createdAt'],
    // Disable Create button — all enquiries come via the website form
    hideAPIURL: true,
  },
  access: {
    create: () => true,   // API route creates enquiries
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      hasMany: false,
      admin: { readOnly: true },
    },
    {
      name: 'variant',
      type: 'relationship',
      relationTo: 'product-variants',
      hasMany: false,
      admin: { readOnly: true },
    },
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
      name: 'message',
      type: 'textarea',
      admin: { readOnly: true },
    },
    {
      name: 'source',
      type: 'text',
      defaultValue: 'product_enquiry',
      admin: { readOnly: true },
    },
    // Admin-editable fields
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Converted', value: 'converted' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Admin Notes',
    },
    {
      name: 'contactedAt',
      type: 'date',
      label: 'Contacted At',
    },
    // Auto-captured metadata
    {
      name: 'ipAddress',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'userAgent',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'referrerUrl',
      type: 'text',
      admin: { readOnly: true },
    },
  ],
}
