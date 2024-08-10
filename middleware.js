export { default } from "next-auth/middleware";

export const config = { matcher: [
    "/dashboard",
    "/listOrder/:path*",
    "/addOrder/:path*",
    "/addTable",
    "/listReport",
    "/listSales"
] };