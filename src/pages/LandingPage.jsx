import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import QuizGrid from '../components/QuizGrid';
import TopScorers from '../components/TopScorers';
import Footer from '../components/Footer';
import AuthDebugger from '../components/AuthDebugger';

function LandingPage() {
    return (<>
        <AuthDebugger />
        <Navbar />
        <Hero />
        <QuizGrid />
        <TopScorers />
        <Footer />

    </>);
}

export default LandingPage;