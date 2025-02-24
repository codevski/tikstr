"use client";
import Link from "next/link";
import React from "react";
import MenuItem from "./menu-items";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";

const SideNav = () => {
  return (
    <div className="fixed  pt-[70px] h-full w-[70px] lg:border-r-0 border-r lg:w-[310px] overflow-auto">
      <div className="lg:w-full w-[55px] mx-auto">
        <Link href="/">
          <MenuItem icon="For You" size="25px" />
        </Link>
        <MenuItem icon="Explore" size="25px" />
        <MenuItem icon="Following" size="25px" />
        <MenuItem icon="Friends" size="25px" />
        <MenuItem icon="Activity" size="25px" />
        <MenuItem icon="Messages" size="25px" />
      </div>
      <div className="lg:block hidden border-b lg:ml-2 mt-2" />

      <div className="lg:block hidden text-[11px] text-gray-500">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="pt-4 px-2">
            <AccordionTrigger>TikStr</AccordionTrigger>
            <AccordionContent className="pt-2 px-1">
              <Link href="/about">Shop</Link>
            </AccordionContent>
            <AccordionContent className="pt-2 px-1">
              <Link href="/about">Contact</Link>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="pt-4 px-2">
            <AccordionTrigger>Terms & Policies</AccordionTrigger>
            <AccordionContent className="pt-2 px-1">
              <Link href="/about">Terms</Link>
            </AccordionContent>
            <AccordionContent className="pt-2 px-1">
              <Link href="/about">Privacy</Link>
            </AccordionContent>
            <AccordionContent className="pt-2 px-1">
              <Link href="/about">Help</Link>
            </AccordionContent>
            <AccordionContent className="pt-2 px-1">
              <Link href="/about">Bug Report</Link>
            </AccordionContent>
            <AccordionContent className="pt-2 px-1">
              <Link href="/about">Contact</Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <p className="pt-4 px-2">© {new Date().getFullYear()} TikStr</p>
      </div>
    </div>
  );
};

export default SideNav;
