"use client";
import React, { useState } from "react";

const ContactUs = () => {
  const [display, setDisplay] = useState(true);
  return (
    <>      
      <section className="py-28 flex items-center justify-center h-full">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <a
              href="#"
              className="bg-[#0e3029] text-base font-normal rounded-[30px] px-[30px] py-[10px] hover:bg-white hover:text-[#0e3029] transition-all inline-block my-7"
            >
              Contact Us
            </a>
            <p className="text-center max-w-lg mx-auto">
              For custom plans or enterprise solutions, reach out to our team.
              We&apos;re here to tailor a package that fits your needs perfectly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
