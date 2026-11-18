export type Route =
  | { name: "today" }
  | { name: "day"; n: number }
  | { name: "archive" }
  | { name: "notes" }
  | { name: "review" }
  | { name: "settings" }
  | { name: "about" };

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#\/?/, "").replace(/\/+$/, "");
  const parts = path.split("/").filter(Boolean);
  const [head, arg] = parts;
  switch (head) {
    case undefined:
      return { name: "today" };
    case "day": {
      const n = Number(arg);
      return Number.isInteger(n) && n >= 1 ? { name: "day", n } : { name: "today" };
    }
    case "archive":
    case "notes":
    case "review":
    case "settings":
    case "about":
      return { name: head };
    default:
      return { name: "today" };
  }
}

class Router {
  route = $state<Route>(parseHash(typeof location === "undefined" ? "" : location.hash));

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("hashchange", () => {
        this.route = parseHash(location.hash);
        window.scrollTo(0, 0);
      });
    }
  }
}

export const router = new Router();
