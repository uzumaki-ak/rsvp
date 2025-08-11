// import { getRSVPs } from "@/app/actions/getRSVPS";
// import { RSVPTable } from "@/app/components/RSVPTable";
// import { Button } from "@/components/ui/button";
// import { House, LogOutIcon } from "lucide-react";
// import Link from "next/link";
// // import { Link } from "lucide-react";

// export default async function RSVPsPage() {
//   const { success, data, message } = await getRSVPs();

//   return (
//     <div className=" container mx-auto mt-8 p-4">
//       <div className="flex justify-center items-centermb-6">
//         <h1 className="text-2xl font-bold">ALL Rsvps</h1>
//         <div className="flex items-center gap-2">
//           <Link href={"/"}>
//             <Button variant={"ghost"}>
//               <House />
//             </Button>
//           </Link>
//           {/* logout */}
//           <Button variant={"outline"}>
//             Logout
//             <LogOutIcon />
//           </Button>
//         </div>
//       </div>
//       {/* //table */}
//       <RSVPTable data={data || []} />
//     </div>
//   );
// }



// import { getRSVPs } from "@/app/actions/getRSVPs";
// import { signOut } from "@/app/actions/auth";
"use client"
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { RSVPTable } from "@/app/components/RSVPTable";
import { House } from "lucide-react";
import Link from "next/link";
import { getRSVPs } from "@/app/actions/getRSVPs";
// import { getRSVPs } from "@/app/actions/getRSVPS";

export default async function RSVPsPage() {
  const { success, data, message } = await getRSVPs();

  if (!success) {
    return <div className="container mx-auto mt-8 p-4">Error: {message}</div>;
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All RSVPs</h1>
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="outline">
              <House />
            </Button>
          </Link>
          <form action={signOut}>
            <Button variant="outline" type="submit">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
      <RSVPTable data={data || []} />
    </div>
  );
}