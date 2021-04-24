import { useEffect } from "react";
import useRouter from "use-react-router";

export default function ScrollToTop() {
  // just run the effect on pathname and/or search change
  const router = useRouter();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [router.location.pathname]);

  // renders nothing, since nothing is needed
  return null;
}
