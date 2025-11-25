import { useEffect } from "react";

export default function ChatbaseLoader() {
  useEffect(() => {
    // don't inject twice
    if (document.getElementById("-tyiTE1ZAXCzJc0LP5d5X")) return;

    (function () {
      if (!window.chatbase || window.chatbase("getState") !== "initialized") {
        const chatbaseFn = (...args) => {
          if (!window.chatbase.q) {
            window.chatbase.q = [];
          }
          window.chatbase.q.push(args);
        };

        // proxy around our function
        window.chatbase = new Proxy(chatbaseFn, {
          get(target, prop) {
            if (prop === "q") {
              return target.q;
            }
            return (...args) => target(prop, ...args);
          },
        });
      }

      const onLoad = function () {
        const script = document.createElement("script");
        script.src = "https://www.chatbase.co/embed.min.js";
        script.id = "-tyiTE1ZAXCzJc0LP5d5X"; // your agent ID
        script.domain = "www.chatbase.co";
        document.body.appendChild(script);
      };

      if (document.readyState === "complete") {
        onLoad();
      } else {
        window.addEventListener("load", onLoad);
      }
    })();
  }, []);

  return null;
}
