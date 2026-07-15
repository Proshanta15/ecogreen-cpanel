import { Schema, model } from "mongoose";

const categoryItemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      minlength: [2, "Item name must be at least 2 characters long"],
      maxlength: [100, "Item name cannot exceed 100 characters"],
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { _id: true },
);

const genderItemsSchema = new Schema(
  {
    men: {
      type: [categoryItemSchema],
      required: false,
      default: [],
    },
    women: {
      type: [categoryItemSchema],
      required: false,
      default: [],
    },
    children: {
      type: [categoryItemSchema],
      required: false,
      default: [],
    },
  },
  { _id: false },
);

const serviceSchema = new Schema(
  {
    id: {
      type: String,
      required: [true, "Category ID is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        "Category ID can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    title: {
      type: String,
      required: [true, "Category title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    icon: {
      type: String,
      required: [true, "Category icon is required"],
      trim: true,
      maxlength: [10, "Icon cannot exceed 10 characters"],
    },
    description: {
      type: String,
      required: [true, "Category description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: [String],
      enum: {
        values: ["Men", "Women", "Children"],
        message: "Gender must be either Men, Women, or Children",
      },
      required: [true, "At least one gender is required"],
      validate: {
        validator: function (value) {
          return value && value.length > 0;
        },
        message: "Please select at least one gender",
      },
    },
    items: {
      type: genderItemsSchema,
      required: true,
      default: {
        men: [],
        women: [],
        children: [],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Add text index for search functionality
serviceSchema.index({
  title: "text",
  description: "text",
  "items.men.name": "text",
  "items.women.name": "text",
  "items.children.name": "text",
});

// Add index for faster queries
serviceSchema.index({ id: 1, isActive: 1 });

// Virtual for total items count
serviceSchema.virtual("totalItems").get(function () {
  const menCount = this.items?.men?.length || 0;
  const womenCount = this.items?.women?.length || 0;
  const childrenCount = this.items?.children?.length || 0;
  return menCount + womenCount + childrenCount;
});

// Virtual for all items combined
serviceSchema.virtual("allItems").get(function () {
  return [
    ...(this.items?.men || []),
    ...(this.items?.women || []),
    ...(this.items?.children || []),
  ];
});

// Virtual for formatted createdAt
serviceSchema.virtual("formattedDate").get(function () {
  return this.createdAt
    ? this.createdAt.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;
});

// Ensure virtuals are included in JSON output
serviceSchema.set("toJSON", { virtuals: true });
serviceSchema.set("toObject", { virtuals: true });

const Service = model("Service", serviceSchema);

export default Service;
