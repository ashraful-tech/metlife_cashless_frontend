import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isHaveAccess } from "./utils/helpers/user.role";

export default withAuth(
	async function middleware(req) {
		const token = await getToken({ req });
		const isAuthenticated = !!token;

		const userType = token?.userType;
		const path = req.nextUrl.pathname;

		const userAccess = isHaveAccess(userType, path);

		if (!userAccess) {
			return NextResponse.redirect(new URL("/sign-in", req.url));
		}

		if (req.nextUrl.pathname.startsWith("/sign-in") && isAuthenticated) {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next();
	},

	{
		callbacks: {
			async authorized({ token }) {
				return !!token?.accessToken;
			},
		},
		pages: {
			signIn: "/sign-in",
		},
	}
);
export const config = {
  matcher: [
    "/",
    "/appoinment",
    "/medical-assessment",
    "/medical-appoinments",
    "/business-team",
    "/metlife",
  ],
};
// "/metlife",
