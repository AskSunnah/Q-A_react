import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Header from '../Components/Home/Header';
import FeedbackForm from "../Components/FeedbackForm";

const ContributeP = () => {


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
            <Header
                title="FeedBack"
            // subtitle="Authentic answers from Dr. Sheikh Falah Kurkully – grounded in Qur’an and Sunnah"
            />
            <Navbar
                dir="ltr"
                navItems={[
                    { label: "Home", href: "/", internal: true },
                    { label: "Library", href: "/library", internal: true },
                    { label: "About Us", href: "/about-us", internal: true },
                    { label: "Feedback", href: "/feedback", internal: true },
                    { label: "Contribute", href: "/contribute", internal: true }
                ]}
                languageSwitcher={{ label: "العربية", href: "/ar/contribute" }}
            />
            <FeedbackForm />    
      <Footer />
        </>
    );
};

export default ContributeP;
