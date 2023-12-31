import mongoose from "mongoose";



const TestSchema = new mongoose.Schema({
  _id: String,
  cartegory: String,
  authorId: String,
  sectionType: String,
  subjectOrlanguage: String,
  sections: [],
  duration: { type: String, required: false },
  description: String,
  status: String,
});

mongoose.models = {};
export const Test = mongoose.model("test", TestSchema);

const partcipantSchema = new mongoose.Schema({
  _id: String,
  fullname: String,
  email: String,
  testId: String,
  taken: Boolean,
  test: { type: Object, required: false },
  score: String,
  reason: String,
  createdAt: { type: Date, default: Date.now },
});

export const Partcipant = mongoose.model("partcipant", partcipantSchema);

const courseSchema = new mongoose.Schema({
  _id: String,
  author: {
    authorId: String,
    name: String,
  },
  description: String,
  price: String,
  title: String,
  type: String,
  courseId: String,
  vidAsset: {
    publicId: String,
    secureURL: String,
  },
  imageAsset: {
    publicId: String,
    secureURL: String,
  },
});

export const Course = mongoose.model("course", courseSchema);

const wishlistAndCartSchema = new mongoose.Schema({
  _id: String,
  owner: String,
  title: String,
  link: String,
  price: String,
  productInfo: {
    id: String,
    authorId: String,
    name: String,
  },
  imageAsset: { type: Object, required: false },
});

export const CartItem = mongoose.model("cart-item", wishlistAndCartSchema);
export const WishListItem = mongoose.model("wish-list-item", wishlistAndCartSchema);

export const Post = mongoose.model(
  "forum-post",
  new mongoose.Schema({
    _id: String,
    authorId: String,
    type: String,
    title: String,
    service: { type: Object, required: false },
    subjects: { type: Array, required: false },
    imageAssets: { type: Array, required: false },
    videoAssets: { type: Array, required: false },
    description: String,
    dueDate: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  })
);

export const Inquiry = mongoose.model(
  "inquiry",
  new mongoose.Schema({
    _id: String,
    authorId: String,
    tutorId: String,
    tutorName: String,
    studentName: String,
    service: {
      label: String,
      price: String,
    },
    subjects: Array,
    topic: String,
    description: String,
    dueDate: String,
    createdAt: { type: Date, default: Date.now },
  })
);

export const InquiryFeedbackSchema = mongoose.model(
  "inquiry-feedback",
  new mongoose.Schema({
    _id: String,
    type: String,
    tutorId: String,
    studentId: String,
    inquiryId: String,
    service: Object,
    serviceTerms: {
      price: String,
      dueDate: String,
    },
    description: String,
    createdAt: { type: Date, default: Date.now },
  })
);

export const NotificationSchema = mongoose.model(
  "notifications",
  new mongoose.Schema({
    owner: String,
    refId: String,
    link: String,
    type: String,
    title: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
  })
);

const UserInfo = {
  id: String,
  sercureURL: String,
  publicId: String,
  name: String,
};

export const TaskSchema = mongoose.model(
  "task",
  new mongoose.Schema({
    _id: String,
    studentInfo: UserInfo,
    tutorInfo: UserInfo,
    service: { price: String, label: String },
    dueDate: String,
    subjects: Array,
    topic: String,
    vidAsset: { type: Object, required: false },
    imageAsset: { type: Object, required: false },
    status: String,
    delivered: {
      files: Array,
      createdAt: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  })
);
export const TaskUpdateSchema = mongoose.model(
  "task-update",
  new mongoose.Schema({
    _id: String,
    taskId: String,
    notifyId: String,
    service: String,
    author: {
      id: String,
      userName: String,
    },
    data: Array,
    taskStatus: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  })
);

export const AcademicAnswerSchema = mongoose.model(
  "academic-answer",
  new mongoose.Schema({
    _id: String,
    postId: String,
    postAuthorId: String,
    author: {
      id: String,
      userName: String,
    },
    upVote: Array,
    downVote: Array,
    data: Array,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  })
);

export const BidSchema = mongoose.model(
  "bid",
  new mongoose.Schema({
    _id: String,
    author: {
      id: String,
      name: String,
    },
    coverLater: String,
    postId: String,
    postAuthorId: String,
    imageAsset: { type: Object, required: false },
    viewed: Boolean,
    awarded: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  })
);

export const CardSchema = mongoose.model(
  "card",
  new mongoose.Schema({
    _id: String,
    owner: String,
    // name: String,
    cardNumber: String,
    expires: String,
    cvc: String,
    preffered: Boolean,
    createdAt: { type: Date, default: Date.now },
  })
);
