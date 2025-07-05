// Assets
import avatar1 from "assets/img/avatars/avatar1.png";
import avatar2 from "assets/img/avatars/avatar2.png";
import avatar3 from "assets/img/avatars/avatar3.png";
import avatar4 from "assets/img/avatars/avatar4.png";
import avatar5 from "assets/img/avatars/avatar5.png";
import avatar7 from "assets/img/avatars/avatar7.png";
import avatar8 from "assets/img/avatars/avatar8.png";
import avatar9 from "assets/img/avatars/avatar9.png";
import avatar10 from "assets/img/avatars/avatar10.png";
// Custom icons
import {
  AdobexdLogo,
  AtlassianLogo,
  InvisionLogo,
  JiraLogo,
  SlackLogo,
  SpotifyLogo,
} from "components/Icons/Icons.js";
import { AiOutlineExclamation } from "react-icons/ai";
import {
  FaArrowDown,
  FaArrowUp,
  FaBell,
  FaCreditCard,
  FaFilePdf,
  FaHtml5,
  FaShoppingCart,
} from "react-icons/fa";
import { SiDropbox } from "react-icons/si";


export const rtlDashboardTableData = [
  {
    logo: AdobexdLogo,
    name: "نسخة Purity UI",
    members: [avatar1, avatar2, avatar3, avatar4, avatar5],
    budget: "$14,000",
    progression: 60,
  },
  {
    logo: AtlassianLogo,
    name: "إضافة مسار التقدم",
    members: [avatar3, avatar2],
    budget: "$3,000",
    progression: 10,
  },
  {
    logo: SlackLogo,
    name: "إصلاح أخطاء النظام الأساسي",
    members: [avatar10, avatar4],
    budget: "غير مضبوط",
    progression: 100,
  },
  {
    logo: SpotifyLogo,
    name: "إطلاق تطبيق الهاتف المحمول الخاص بنا",
    members: [avatar2, avatar3, avatar7, avatar8],
    budget: "$32,000",
    progression: 100,
  },
  {
    logo: JiraLogo,
    name: "أضف صفحة التسعير الجديدة",
    members: [avatar10, avatar3, avatar7, avatar2, avatar8],
    budget: "$400",
    progression: 25,
  },
  {
    logo: InvisionLogo,
    name: "إعادة تصميم متجر جديد على الإنترنت",
    members: [avatar9, avatar3, avatar2],
    budget: "$7,600",
    progression: 40,
  },
];

export const rtlTimelineData = [
  {
    logo: FaBell,
    title: "$2400, تغييرات في التصميم",
    date: "22 DEC 7:20 PM",
    color: "teal.300",
  },
  {
    logo: FaHtml5,
    title: "طلب جديد #4219423",
    date: "21 DEC 11:21 PM",
    color: "orange",
  },
  {
    logo: FaShoppingCart,
    title: "مدفوعات الخادم لشهر أبريل",
    date: "21 DEC 9:28 PM",
    color: "blue.400",
  },
  {
    logo: FaCreditCard,
    title: "تمت إضافة بطاقة جديدة للطلب #3210145",
    date: "20 DEC 3:52 PM",
    color: "orange.300",
  },
  {
    logo: SiDropbox,
    title: "فتح الحزم من أجل التنمية",
    date: "19 DEC 11:35 PM",
    color: "purple",
  },
  {
    logo: AdobexdLogo,
    title: "طلب جديد #9851258",
    date: "18 DEC 4:41 PM",
  },
];


export const dashboardTableData = [
  {
    logo: AdobexdLogo,
    name: "Fixed Deposit Account",
    members: [],
    budget: "₦1,000,000",
    date: "1 JUN 5:00 PM",
    progression: 80,
  },
  {
    logo: AtlassianLogo,
    name: "Budget 2025",
    members: [],
    budget: "₦10,000,000",
    date: "25 JAN 11:00 PM",
    progression: 60,
  },
  {
    logo: SlackLogo,
    name: "Loan Disbursement",
    members: [],
    budget: "₦500,000",
    date: "5 FEB 8:00 PM",
    progression: 90,
  },
];

export const timelineData = [
  {
    logo: FaBell,
    title: "₦4,200,000 deposit confirmed",
    date: "26 JUN 9:20 AM",
    color: "teal.300",
  },
  {
    logo: FaHtml5,
    title: "Withdrawal request ₦2,000,000",
    date: "25 JUN 5:00 PM",
    color: "orange",
  },
  {
    logo: FaShoppingCart,
    title: "Payment received: ₦800,000",
    date: "24 JUN 4:30 PM",
    color: "blue.400",
  },
];

export const tablesTableData = [
  {
    logo: avatar1,
    name: "Oliver Liam",
    email: "oliver@wealthplus.com",
    subdomain: "Portfolio Manager",
    domain: "Transfer",
    status: "Success",
    date: "12/06/24",
  },
  {
    logo: avatar2,
    name: "Sophia Lee",
    email: "sophia@wealthplus.com",
    subdomain: "Financial Analyst",
    domain: "Airtime",
    status: "Pending",
    date: "10/06/24",
  },
];

export const invoicesData = [
  {
    date: "June 20, 2024",
    code: "#INV-452874",
    price: "₦1,200,000",
    logo: FaFilePdf,
    format: "PDF",
  },
];

export const billingData = [
  {
    name: "Oliver Liam",
    company: "Viking Ventures",
    email: "oliver@vikingventures.com",
    number: "INV1235476",
  },
];

export const newestTransactions = [
  {
    name: "DSTV Subscription",
    date: "26 June 2024, 10:30 AM",
    price: "- ₦20,000",
    logo: FaArrowDown,
  },
  {
    name: "First Bank Deposit",
    date: "26 June 2024, 8:45 AM",
    price: "+ ₦450,000",
    logo: FaArrowUp,
  },
];

export const olderTransactions = [
  {
    name: "Stripe Payment",
    date: "25 June 2024, 02:30 PM",
    price: "+ ₦850,000",
    logo: FaArrowUp,
  },
  {
    name: "Microsoft Azure",
    date: "22 June 2024, 04:30 PM",
    price: "- ₦320,000",
    logo: FaArrowDown,
  },
];