import Link from "next/link";
import logo from "../../public/images/transperant-logo.png";
import Image from "next/image";

const Rastaurant = () => {
  return (
    <div className="w-screen flex flex-col h-[inherit] relative after:h-full after:w-full after:bg-no-repeat after:bg-cover after:bg-[url('../public/images/body-bg.png')] after:absolute after:top-0 after:left-0 after:z-10">
      <header className="w-11/12 py-1.5 md:py-3 px-2 md:px-6 rounded-full relative z-50 mt-4 mx-auto block bg-[rgba(255,255,255,0.08)] border border-solid border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center justify-between">
          <a href="/" className="block max-w-12 md:max-w-16">
            <Image width={100} height={100} src={logo} className="max-w-full h-auto block" alt="logo" />
          </a>
          <div className="flex gap-2">
            <Link
              href="/signup"
              className="block text-sm sm:text-base text-white font-semibold md:text-lg bg-[rgba(255,255,255,0.05)] hover:bg-white hover:text-black border border-solid border-white rounded-full py-2 px-5 transition-all duration-200 ease-in"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="block text-sm sm:text-base text-white font-semibold md:text-lg bg-[rgba(255,255,255,0.05)] hover:bg-white hover:text-black border border-solid border-white rounded-full py-2 px-5 transition-all duration-200 ease-in"
            >
              Login
            </Link>
          </div>
        </div>
      </header>
      <section className="flex-grow flex flex-col justify-center items-center relative z-20 p-10">
        <>
          <div className="grid gap-32 text-center max-w-4xl">
            <div className="grid gap-2.5">
              <h1 className="text-3xl md:text-4xl lg:text-5xl 2xl:text-7xl 2xl:leading-tight font-semibold bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text transition-all duration-200 ease-in">
                Voice AI for Restaurants
              </h1>
              <p className="text-white text-base md:text-xl">Introducing Hirekarigar&apos;s AI Captains</p>
              <p className="text-white text-sm md:text-base">
                Elevate your restaurant service with our AI-based captains. Designed to assist during rush hours, our AI captains streamline your
                operations and enhance customer satisfactions for your restaurants , to help you solve your hiring needs during rush hours.
              </p>
            </div>
            <div className="flex justify-center items-center gap-4">
              <a
                href="https://api.whatsapp.com/send/?phone=917581950924&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noreferrer"
                className="flex group items-center gap-2.5 hover:text-white font-semibold text-lg hover:bg-[rgba(255,255,255,0.05)] bg-white border border-solid border-white text-black rounded-full py-2 px-5 transition-all duration-200 ease-in"
              >
                Get in touch
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.2477 13.4907H5.09766C4.81432 13.4907 4.57682 13.3949 4.38516 13.2032C4.19349 13.0116 4.09766 12.7741 4.09766 12.4907C4.09766 12.2074 4.19349 11.9699 4.38516 11.7782C4.57682 11.5866 4.81432 11.4907 5.09766 11.4907H16.2477L13.3977 8.64073C13.1977 8.44073 13.1018 8.2074 13.1102 7.94073C13.1185 7.67407 13.2143 7.44073 13.3977 7.24073C13.5977 7.04073 13.8352 6.93657 14.1102 6.92823C14.3852 6.9199 14.6227 7.01573 14.8227 7.21573L19.3977 11.7907C19.4977 11.8907 19.5685 11.9991 19.6102 12.1157C19.6518 12.2324 19.6727 12.3574 19.6727 12.4907C19.6727 12.6241 19.6518 12.7491 19.6102 12.8657C19.5685 12.9824 19.4977 13.0907 19.3977 13.1907L14.8227 17.7657C14.6227 17.9657 14.3852 18.0616 14.1102 18.0532C13.8352 18.0449 13.5977 17.9407 13.3977 17.7407C13.2143 17.5407 13.1185 17.3074 13.1102 17.0407C13.1018 16.7741 13.1977 16.5407 13.3977 16.3407L16.2477 13.4907Z"
                    className="group-hover:fill-white"
                    fill="black"
                  />
                </svg>
              </a>
            </div>
          </div>
        </>
      </section>
    </div>
  );
};

export default Rastaurant;
