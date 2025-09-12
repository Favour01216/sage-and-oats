"use client";

import { SearchBox as AlgoliaSearchBox } from "react-instantsearch";

export default function SearchBox() {
  return (
    <AlgoliaSearchBox
      placeholder="Search for recipes..."
      classNames={{
        root: "w-full",
        form: "relative",
        input:
          "w-full px-4 py-3 pr-12 bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-xl text-text dark:text-text-dark placeholder:text-muted dark:placeholder:text-muted-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200",
        submit:
          "absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors",
        submitIcon: "w-5 h-5",
        reset:
          "absolute right-10 top-1/2 -translate-y-1/2 p-2 text-muted dark:text-muted-dark hover:text-text dark:hover:text-text-dark transition-colors hidden",
        resetIcon: "w-4 h-4",
      }}
    />
  );
}
