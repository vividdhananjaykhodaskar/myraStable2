"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { verifyAccount } from "@/service/auth";
import Link from "next/link";

const VerifyAccountClient = () => {
  const searchParams = useSearchParams();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleVerifyAccount = async (token: string) => {
    const verifyAccountRes = await verifyAccount(token);
    if (verifyAccountRes.success) {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      setErrorMessage(verifyAccountRes.message || "Something went wrong");
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) handleVerifyAccount(token);
  }, [searchParams]);

  return (
    <div className="max-w-lg w-full rounded-xl bg-white/15 xl:p-8 p-5 py-6 relative z-20">
      <Image
        src="/icon/vomyraLogo.svg"
        width={200}
        height={80}
        alt="logo"
        className="mx-auto block rounded-full mb-3"
      />

      {isVerified === null ? (
        <p className="text-center text-gray-500">Verifying...</p>
      ) : isVerified ? (
        <div className="text-center text-green-500">
          <h2 className="text-xl font-semibold">
            Account Verified Successfully!
          </h2>
          <p>
            You're now ready to use your account.{" "}
            <Link
              href="/login"
              className="underline"
            >
              Login
            </Link>
          </p>
        </div>
      ) : (
        <div className="text-center text-red-500">
          <h2 className="text-xl font-semibold">Verification Failed</h2>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyAccountClient;
