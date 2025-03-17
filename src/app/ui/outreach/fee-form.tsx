// "use client";

// import { Copy } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { OutreachType } from "@/lib/types/common";
// import { copyToClipboard } from "@/lib/utils";
// import { useState } from "react";

// export function OutreachFeeForm({ outreach }: { outreach: OutreachType }) {
//   const [fee, setFee] = useState("Copy");
//   const outreachLink = `${window.location.origin}/outreach/${outreach.id}`;

//   const handleCopySuccess = () => {
//     setCopyText("Copied!");
//     setTimeout(() => setCopyText("Copy"), 3000);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">Share</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Share link</DialogTitle>
//           <DialogDescription>
//             Anyone who has this link will be able to view the outreach event
//             register page.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex items-center space-x-2">
//           <div className="grid flex-1 gap-2">
//             <Label htmlFor="link" className="sr-only">
//               Link
//             </Label>
//             <Input id="link" defaultValue={outreachLink} readOnly />
//           </div>
//           <Button
//             onClick={() => copyToClipboard(outreachLink, handleCopySuccess)}
//             type="submit"
//             size="sm"
//             className="px-3"
//           >
//             <span className="sr-only">{copyText}</span>
//             <Copy />
//             {copyText}
//           </Button>
//         </div>
//         <DialogFooter className="sm:justify-start">
//           <DialogClose asChild>
//             <Button type="button" variant="secondary">
//               Close
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
