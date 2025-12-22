import AOS from "aos";

useEffect(() => {
AOS.init({
duration: 800,
once: false,
mirror: true,
});
}, []);
