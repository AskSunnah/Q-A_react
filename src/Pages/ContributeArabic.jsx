// ------------------------------
// FRONTEND - ContributePageAr.jsx
// ------------------------------

import React from "react";
// import Header from "../Components/Contribute/Header";
import Navbar from "../Components/Navbar";
import Contribute from "../Components/Contribute/Contribute";
import Header from '../Components/Home/Header'; // Adjust the import path as necessary


const ContributePageAr = () => {


    return (
        <>

                <style>
                {`
    :root {
      --primary: #1f6f3e;
      --secondary: #2e8b57;
      --background: #f7f7f7;
      --card-bg: #ffffff;
      --accent-bg: #f0f4fa;
      --text-color: #2c3e50;
      --font-family: "Segoe UI", sans-serif;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--background);
      color: var(--text-color);
      line-height: 1.6;
    }

    header {
      background-color: var(--primary);
      color: #fff;
      padding: 2.5rem 1.25rem;
      text-align: center;
    }

    header h1 {
      font-size: 2.5rem;
    }

    header p {
      margin-top: 0.5rem;
      font-size: 1.1rem;
    }

    main {
      max-width: 900px;
      margin: 2rem auto;
      padding: 1.5rem;
      background: var(--card-bg);
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    section {
      margin-bottom: 2rem;
    }

    h2, h3 {
      color: var(--primary);
    }

    
    

     @media (max-width: 768px) {
      header h1 {
        font-size: 1.8rem;
      }

      header {
        padding: 2rem 1rem;
      }

      header p {
        font-size: 1rem;
      }

   
      
    }

   

  
    
  `}
            </style>
            {/* <Header lang="ar" /> */}
             <Header
                title="ساهم معنا"
                // subtitle="احصل على إجابات شرعية موثوقة من الشيخ الدكتور فلاح كركولي — مستندة من القرآن والسنة (نسخة تجريبية)"
                dir="rtl"
            />
            <Navbar
                dir="rtl"
                navItems={[
                    { label: "الرئيسية", href: "/ar", internal: true },
                    { label: "المكتبة", href: "/library_ar", internal: true },
                    { label: "عن الموقع", href: "/about-us/ar", internal: false },
                    { label: "شاركنا رأيك", href: "https://forms.gle/e5jGuDBJhZAyCP448", internal: false },
                    { label: "ساهم", href: "/ar/contribute", internal: false }
                ]}
                languageSwitcher={{ label: "English", href: "/" }}
            />
            <Contribute lang="ar" />
        </>
    );
};

export default ContributePageAr;
