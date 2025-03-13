import { OutreachType } from "@/lib/types/common";
import { PhoneIcon, MailIcon } from "lucide-react";

export default function Footer({ data }: { data: OutreachType }) {
  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-row flex-wrap justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">About the Event</h3>
            <p className="text-muted-foreground mb-4 sm:max-w-40">
              Outreach is an event organized by the Student Missionary Group
              annually, to carry the light of the gospel to men across the land.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Information</h3>
            <div className="space-y-3">
              {/* <div className="flex items-start">
                <MapPinIcon className="h-5 w-5 mr-2 mt-0.5" />
                <span>
                  Community Center
                  <br />
                  123 Main Street
                  <br />
                  Anytown, ST 12345
                </span>
              </div> */}
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span>(234) 08133642174</span>
              </div>
              <div className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2" />
                <span>isaac33robert@gmail.com</span>
              </div>
            </div>
          </div>

          {/* <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Event Schedule
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Speakers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Sponsors
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="border-t mt-8 pt-8 text-left text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} {data.theme}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
