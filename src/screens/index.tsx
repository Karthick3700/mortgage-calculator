import React, { useState, FormEvent, Fragment } from "react";
import btnicon from "@/styles/assets/images/icon-calculator.svg";
import icon from "@/styles/assets/images/illustration-empty.svg";
import Image from "next/image";
import Head from "next/head";

const initialState = {
  amount: "",
  years: "",
  interestRate: "",
  mortageType: "",
};

const MainScreen = () => {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    monthlyRepayment: number;
    totalRepayment: number;
  } | null>(null);

  const handleOnChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setError((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleMortageTypeChange = (value: string) => {
    setValues((prev) => ({ ...prev, mortageType: value }));
  };

  const validateForm = () => {
    const newErrors = { ...initialState };
    if (!values.amount) {
      newErrors.amount = "Please enter a mortgage amount";
    }
    if (!values.years) {
      newErrors.years = "Please enter a mortgage term";
    }
    if (!values.interestRate) {
      newErrors.interestRate = "Please enter an interest rate";
    }
    if (!values.mortageType) {
      newErrors.mortageType = "Please select a mortgage type";
    }

    setError(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const calculateMortgage = (values: any) => {
    const { amount, years, interestRate, mortageType } = values;

    const principal = parseFloat(amount);
    const annualInterestRate = parseFloat(interestRate) / 100;
    const months = parseInt(years) * 12;
    let monthlyRepayment = 0;
    let totalRepayment = 0;

    if (mortageType === "repayment") {
      const monthlyInterest = annualInterestRate / 12;
      monthlyRepayment =
        (principal * monthlyInterest) /
        (1 - Math.pow(1 + monthlyInterest, -months));

      totalRepayment = monthlyRepayment * months;
    } else if (mortageType === "interestOnly") {
      monthlyRepayment = (principal * annualInterestRate) / 12;
      totalRepayment = monthlyRepayment * months;
    }

    return {
      monthlyRepayment: Math.round(monthlyRepayment),
      totalRepayment: Math.round(totalRepayment),
    };
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmitting(true);
      const calculationResult = calculateMortgage(values);
      setResult(calculationResult);
      setSubmitting(false);
    }
  };

  return (
    <Fragment>
      <Head>
        <title>Mortage Calculator</title>
      </Head>
      <div className="bg-slate-100 ">
        <div className="container flex justify-center items-center min-h-dvh ">
          <div className="grid grid-cols-1 md:grid-cols-2  bg-white rounded-[25px] overflow-hidden max-w-[1050px]">
            <div className="p-8 w-full">
              <div className="flex justify-between items-center">
                <h1 className="font-bold md:text-3xl text-xl">
                  Mortgage Calculator
                </h1>
                <button
                  onClick={() => setValues(initialState)}
                  className="md:text-lg text-sm underline-offset-4 underline decoration-slate-500 text-slate-500 "
                >
                  Clear All
                </button>
              </div>
              <form
                className="flex gap-8 flex-col mt-8"
                onSubmit={handleSubmit}
              >
                <div className="flex flex-col justify-start items-start w-full gap-2">
                  <label className="text-slate-500 font-sans font-extrabold">
                    Mortgage Amount
                  </label>
                  <div className="border-slate-300 border-[1px] min-h-[50px] w-full flex rounded-[6px] overflow-hidden">
                    <div className="bg-slate-100 w-2/12 text-slate-500 p-2 flex items-center justify-center text-xl font-bold ">
                      ₹
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      className="w-10/12 border-none font-semibold outline-none p-2 no-spinner"
                      value={values.amount}
                      onChange={(e) => handleOnChange("amount", e.target.value)}
                    />
                  </div>
                  {error.amount && (
                    <div className="text-red-500 text-sm">{error.amount}</div>
                  )}
                </div>
                <div className="flex w-full gap-2 justify-between flex-wrap md:flex-nowrap">
                  <div className="flex flex-col gap-2 md:w-1/2 w-full">
                    <label className="font-bold text-slate-500">
                      Mortgage Term
                    </label>
                    <div className="position-relative overflow-hidden rounded-[6px] flex border-slate-300 border-[1px] min-h-[50px]">
                      <input
                        type="number"
                        className="border-none outline-none no-spinner p-2 w-9/12 font-sans font-bold"
                        value={values.years}
                        onChange={(e) =>
                          handleOnChange("years", e.target.value)
                        }
                      />
                      <div className="bg-slate-100 font-bold flex justify-center text-slate-500 items-center py-2 px-4 w-3/12">
                        Years
                      </div>
                    </div>
                    {error.years && (
                      <div className="text-red-500 text-sm">{error.years}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 md:w-1/2 w-full">
                    <label className="font-bold text-slate-500">
                      Interest Rate
                    </label>
                    <div className="border-slate-300 rounded-[6px] border-[1px] overflow-hidden min-h-[50px] flex w-full">
                      <input
                        type="number"
                        className="no-spinner border-none outline-none p-2 w-9/12 font-sans font-bold"
                        value={values.interestRate}
                        onChange={(e) =>
                          handleOnChange("interestRate", e.target.value)
                        }
                      />
                      <div className="bg-slate-100 text-slate-500 font-bold flex text-xl justify-center items-center p-2 w-3/12">
                        %
                      </div>
                    </div>
                    {error.interestRate && (
                      <div className="text-red-500 text-sm">
                        {error.interestRate}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  <label className="text-slate-500 font-sm font-bold">
                    Mortgage Type
                  </label>
                  <div className="border-slate-300 border-[1px] mt-2 min-h-[50px] flex items-center px-4 gap-4">
                    <div className="grid place-items-center">
                      <input
                        type="radio"
                        className="col-start-1 row-start-1 appearance-none shrink-0 w-4 h-4 border-2 border-lime rounded-full"
                        checked={values.mortageType === "repayment"}
                        onChange={() => handleMortageTypeChange("repayment")}
                      />
                      {values.mortageType === "repayment" && (
                        <div className="col-start-1 row-start-1 w-2 h-2 rounded-full bg-lime" />
                      )}
                    </div>
                    <label className="font-bold text-slate-800">
                      Repayment
                    </label>
                  </div>
                  <div className="border-slate-300 border-[1px] min-h-[50px] flex items-center px-4 gap-4">
                    <div className="grid place-items-center">
                      <input
                        type="radio"
                        className="col-start-1 row-start-1 appearance-none shrink-0 w-4 h-4 border-2 border-lime rounded-full"
                        checked={values.mortageType === "interestOnly"}
                        onChange={() => handleMortageTypeChange("interestOnly")}
                      />
                      {values.mortageType === "interestOnly" && (
                        <div className="col-start-1 row-start-1 w-2 h-2 rounded-full bg-lime" />
                      )}
                    </div>
                    <label className="font-bold text-slate-800">
                      Interest Only
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center gap-4 bg-lime px-8 py-4 rounded-[30px]"
                  >
                    <Image src={btnicon} alt="calculator svg" />
                    <span className="font-bold text-normal md:text-lg">
                      Calculate Repayments
                    </span>
                  </button>
                </div>
              </form>
            </div>
            <div className=" bg-slate-900 md:rounded-es-[50px] flex items-center justify-center p-4 md:p-12">
              <div className="flex  flex-col h-auto justify-center gap-6 items-center w-full">
                {result ? (
                  <Fragment>
                    <div className="flex flex-col w-full gap-8">
                      <h2 className="text-white">Your Results</h2>
                      <p className="text-slate-500 text-normal">
                        Your result are shown below based on the information you
                        provided. To adjust the results, edit the form and click
                        'calculate repayments' again.
                      </p>
                      <div className=" p-4 rounded-lg shadow-md bg-slate-950 w-12/12 border-t-[2px] border-t-lime">
                        <div className="flex flex-col gap-2">
                          {values.mortageType === "repayment" && (
                            <Fragment>
                              <div className="flex flex-col p-2">
                                <div className="font-bold text-md text-slate-500">
                                  Your monthly repayments
                                </div>
                                <div className=" text-lime text-6xl font-bold mt-2">
                                  ₹ {result.monthlyRepayment}
                                </div>
                                <div className="font-bold text-md  text-slate-500 mt-4">
                                  Total you'll repay over the term
                                </div>
                                <div className="text-white text-normal font-semibold mt-2">
                                  ₹ {result.totalRepayment}
                                </div>
                              </div>
                            </Fragment>
                          )}
                          {values.mortageType === "interestOnly" && (
                            <Fragment>
                              <div className="flex flex-col p-2">
                                <div className="font-bold text-md text-slate-500">
                                  Monthly Interest
                                </div>
                                <div className=" text-lime text-6xl font-bold mt-2">
                                  ₹ {result.monthlyRepayment}
                                </div>
                                <div className="font-bold text-md  text-slate-500 mt-4">
                                  Total Interest
                                </div>
                                <div className="text-white text-normal font-semibold mt-2">
                                  ₹ {result.totalRepayment}
                                </div>
                              </div>
                            </Fragment>
                          )}
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    <Image src={icon} alt="default ui" />
                    <h2 className="text-2xl font-bold text-white">
                      Results shown here
                    </h2>
                    <p className="text-slate-300 text-normal text-center">
                      Complete the form and click "calculate repayments" to see
                      what your monthly repayments would be.
                    </p>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MainScreen;
