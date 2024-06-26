import getGoogleOAuthURL from "@/utils/getGoogleUrl";
import Link from "next/link";

export default function Home() {
  return (
   <div>
   <Link href={getGoogleOAuthURL()}>
    Sign in to Google
   </Link>
   </div>
  );
}
