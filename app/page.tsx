import Image from "next/image";
import React from "react";
import Restaurant from "@/public/icon/restaurant.svg";
import HotelBookingAgent from "@/public/icon/hotelbooking.svg";
import Realestateagent from "@/public/icon/realestateagent.svg";
import Link from "next/link";
import TalkToMyra from "@/component/pages/call/TalkToMyra";
import AuthNavButton from "@/component/AuthNavButton";

const Home = () => {
  const wirtetoMasseg = "Hello Myra, I want to talk to you";

  return (
    <div className="nt-ai-bg">
      <section className="home-myra-section md:py-28 sm:py-24 py-20 md:pb-10 sm:pb-12 pb-12">
        <div className="container mx-auto px-4">
          <h2 className="py-2 mx-auto text-white relative h-fit font-semibold tracking-wide text-3xl sm:text-[46px] sm:leading-[60px] mb-2 sm:mb-4 lg:text-[56px] lg:min-w-[790px] lg:leading-[80px] text-center mt-10 sm:mt-0">
            Myra - Voice AI Agents for Everyone
          </h2>
          <p className="mb-10 sm:mb-16 max-w-xl mx-auto text-base sm:text-lg md:text-xl leading-6 sm:leading-8 text-center">
            Real-time Conversations Across Industries in Hindi and Multiple Indian Languages
          </p>

          <TalkToMyra />
          <div className="flex gap-4 justify-center mt-8 items-center">
            <AuthNavButton title="Try for Free" path="/dashboard" />

            <Link
              href={` https://wa.me/${1234567890}?text=${encodeURIComponent(wirtetoMasseg)}`}
              className="bg-[url('/icon/rightArrow.svg')] bg-no-repeat pr-3  bg-[right_center] text-base font-normal "
            >
              <span className="mr-3"> Get in Touch</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="sm:py-16 py-10">
        <div className="container mx-auto px-4">
          <div className="">
            <h3 className="sm:text-4xl text-2xl text-center mb-10 text-[#0087ff] font-bold bg-clip-text ">Use Cases</h3>
            <div className="flex flex-wrap">
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6 ">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={Restaurant} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">Restaurant</h4>
                  <i className="text-sm">&quot;Effortless Order Management & Upselling&quot;</i>
                  <p className="text-sm mt-2">
                    Myra seamlessly takes orders, suggests complementary items, and enhances customer experiences with real-time conversations in multiple
                    languages.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={HotelBookingAgent} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">Hotel Booking Agent</h4>
                  <i className="text-sm">&quot;Streamlined Hotel Reservations with Personalized Offers&quot;</i>
                  <p className="text-sm mt-2">
                    Myra assists guests in booking rooms, offering tailored discounts, and handling inquiries with instant responses, reducing booking times.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={Realestateagent} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">Real Estate Agent </h4>
                  <i className="text-sm">&quot;Instant Property Assistance for Buyers & Sellers&quot;</i>
                  <p className="text-sm mt-2">
                    Myra connects with clients, showcases property options, and schedules site visits, handling all real estate inquiries efficiently.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={"/icon/loan.svg"} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">Loan, Insurance, and Credit Cards</h4>
                  <i className="text-sm">&quot;Simplified Financial Product Assistance&quot;</i>
                  <p className="text-sm mt-2">
                    Myra guides customers through loan applications, insurance plans, and credit card offerings, providing quick answers and personalized
                    product recommendations.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={HotelBookingAgent} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">Recruitment Agent</h4>
                  <i className="text-sm">&quot;Efficient Job Matching & Candidate Screening&quot;</i>
                  <p className="text-sm mt-2">
                    Myra assists recruiters by pre-screening candidates, scheduling interviews, and providing real-time updates on job openings and candidate
                    status.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={HotelBookingAgent} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">ISP Technical Support</h4>
                  <i className="text-sm">&quot;Real-Time Resolution for Internet Issues&quot;</i>
                  <p className="text-sm mt-2">
                    Myra offers technical support by diagnosing internet problems, troubleshooting connectivity issues, and guiding users through solutions in
                    multiple languages.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={Realestateagent} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">Sales Agent</h4>
                  <i className="text-sm">&quot;Maximizing Conversions with Personalized Pitches&quot;</i>
                  <p className="text-sm mt-2">
                    Myra engages potential customers, explains product benefits, and tailors offers to boost sales conversion rates in real-time.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={HotelBookingAgent} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">Dental Appointment Booking </h4>
                  <i className="text-sm">&quot;Quick and Easy Dental Appointment Scheduling&quot;</i>
                  <p className="text-sm mt-2">
                    Myra helps patients book dental appointments, confirm availability, and send reminders, making the process hassle-free.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={HotelBookingAgent} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">Customer Support Agent</h4>
                  <i className="text-sm">&quot;24/7 Instant Customer Query Resolution&quot;</i>
                  <p className="text-sm mt-2">
                    Myra answers customer questions, resolves issues, and ensures satisfaction with instant, human-like support in any language.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full sm:px-3 px-0 mb-6">
                <div className="p-5 bg-black border border-[#0e3029] rounded-lg text-center h-full shadow-sm">
                  <Image src={"/icon/ai.svg"} alt="" width={30} height={30} className="mx-auto" />
                  <h4 className="text-lg font-semibold mb-3 mt-2">AI Toys </h4>
                  <i className="text-sm">&quot;Interactive Play with Voice-Activated Fun&quot;</i>
                  <p className="text-sm mt-2">
                    Myra powers AI toys with engaging, conversational interactions, creating fun, educational experiences for children in multiple languages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sm:py-16 py-10">
        <div className="container mx-auto px-4">
          <div>
            <h3 className="sm:text-4xl text-2xl text-center mb-10 text-[#0087ff] font-bold bg-clip-text ">Features</h3>
            {/* <p className="text-center mb-10">
              Sure, here are the revised headings with more detailed subheadings:
            </p> */}
            <div className="flex flex-wrap bg-[rgba(0,_0,_0,_0.54)]">
              <div className="lg:w-1/3 sm:w-1/2 w-full border border-[#3d3d3d] sm:p-8 p-4 text-center">
                <Image src={"/icon/orders.svg"} alt="" width={30} height={30} className="mx-auto" />
                <h4 className="text-lg font-semibold mb-3 mt-3">Instant Orders with Petpooja POS </h4>
                <p className="text-sm mt-2">
                  Sync orders directly with Petpooja, India’s leading POS system. Myra eliminates manual entry, ensuring accuracy and efficiency for your
                  restaurant.
                </p>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full border border-[#3d3d3d] sm:p-8 p-4 text-center">
                <Image src={"/icon/Sheets.svg"} alt="" width={30} height={30} className="mx-auto" />
                <h4 className="text-lg font-semibold mb-3 mt-3">Easy Data with Google Sheets</h4>
                <p className="text-sm mt-2">
                  Effortlessly collect and analyze customer data using Google Sheets. Myra integrates seamlessly, making data management simple for everyone.
                </p>
              </div>
              <div className="lg:w-1/3 sm:w-1/2 w-full border border-[#3d3d3d] sm:p-8 p-4 text-center">
                <Image src={"/icon/ai.svg"} alt="" width={30} height={30} className="mx-auto" />
                <h4 className="text-lg font-semibold mb-3 mt-3">Plug-and-Play AI Agents</h4>
                <p className="text-sm mt-2">
                  Deploy Myra’s AI agents for phone and web interactions in just minutes. Enjoy a hassle-free setup that automates customer service with ease.
                </p>
              </div>
              <div className="sm:w-1/2 w-full border border-[#3d3d3d] sm:p-8 p-4 text-center">
                <Image src={HotelBookingAgent} alt="" width={30} height={30} className="mx-auto" />
                <h4 className="text-lg font-semibold mb-3 mt-3">Multilingual Support</h4>
                <p className="text-sm mt-2">
                  Engage your customers in their preferred language—Hindi, Tamil, and more. Myra provides personalized interactions across multiple Indian
                  languages.
                </p>
              </div>
              <div className="sm:w-1/2 w-full border border-[#3d3d3d] sm:p-8 p-4 text-center">
                <Image src={"/icon/industry.svg"} alt="" width={30} height={30} className="mx-auto" />
                <h4 className="text-lg font-semibold mb-3 mt-3">Versatile AI for Any Industry</h4>
                <p className="text-sm mt-2">
                  {" "}
                  From restaurants to real estate, Myra adapts to various business needs. Our AI solution fits perfectly across different sectors.
                </p>
              </div>
              <div className="sm:w-1/2 w-full border border-[#3d3d3d] sm:p-8 p-4 text-center">
                <Image src={"/icon/response.svg"} alt="" width={30} height={30} className="mx-auto" />
                <h4 className="text-lg font-semibold mb-3 mt-3">Lightning-Fast Response Times</h4>
                <p className="text-sm mt-2">Experience near-instant replies with Myra’s optimized AI. Enjoy smooth, real-time conversations without any lag.</p>
              </div>
              <div className="sm:w-1/2 w-full border border-[#3d3d3d] sm:p-8 p-4 text-center">
                <Image src={"/icon/conversation.svg"} alt="" width={30} height={30} className="mx-auto" />
                <h4 className="text-lg font-semibold mb-3 mt-3">Smart Conversation Management</h4>
                <p className="text-sm mt-2">
                  Myra expertly handles interruptions and pauses. Our AI ensures seamless and natural conversations, just like speaking to a human.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sm:py-20 py-10">
        <div className="container mx-auto px-4">
          <h3 className="sm:text-4xl text-2xl text-center mb-10 text-[#0087ff] font-bold bg-clip-text ">Partners </h3>
          <div className="marquee-container">
            <div className="marquee">
              <div className="marquee-content">
                <div className="nt-logo">
                  <Image src={"/images/Petpopoja.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/XeroDegrees.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/DesiHandi.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/DesiVibes.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Cafeheartbeat.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Azure.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Petpopoja.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/XeroDegrees.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/DesiHandi.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/DesiVibes.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Cafeheartbeat.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Azure.png"} width={120} height={120} alt="img" />
                </div>
              </div>
              <div className="marquee-content">
                <div className="nt-logo">
                  <Image src={"/images/Petpopoja.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/XeroDegrees.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/DesiHandi.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/DesiVibes.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Cafeheartbeat.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Azure.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Petpopoja.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/XeroDegrees.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/DesiHandi.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/DesiVibes.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Cafeheartbeat.png"} width={120} height={120} alt="img" />
                </div>
                <div className="nt-logo">
                  <Image src={"/images/Azure.png"} width={120} height={120} alt="img" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="sm:py-20 py-10">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="sm:text-4xl text-2xl text-center mb-10 text-[#0087ff] font-bold bg-clip-text ">Pricing</h3>
            <div className="w-full max-w-4xl mx-auto bg-[rgba(0,_0,_0,_0.54)] sm:p-10 p-5 rounded-lg">
              <h3 className="text-center sm:text-4xl text-2xl font-semibold">
                Pay as You Go at <span className="text-[#4794b5]">Just ₹5 per Minute</span>
              </h3>
              <div className="mt-6">
                <AuthNavButton title="Start a Free Trial Now" path="/dashboard" />
              </div>
              <p className="text-center max-w-lg mx-auto mt-3">
                Experience Myra at no cost with a free trial. Get started and see how our AI can transform your business without any initial commitment.
              </p>
              <h4 className="text-[green] sm:text-2xl text-xl font-semibold text-center mt-5">Affordable Plans</h4>

              <p className="text-center max-w-lg mx-auto mt-3">
                Enjoy Myra’s full range of features for only ₹5 per minute. Our flexible pricing ensures you only pay for what you use, making advanced AI
                accessible for every business.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
