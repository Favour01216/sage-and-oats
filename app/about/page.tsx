export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-8">
          About Sage & Oat
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Mindful recipes for nourishing meals. We believe in the power of
          simple ingredients, bold flavors, and beautiful presentation to
          transform everyday cooking into something special.
        </p>

        <h2>Our Mission</h2>
        <p>
          At Sage & Oat, we&apos;re passionate about making wholesome cooking
          accessible to everyone. Our carefully curated recipes focus on fresh,
          seasonal ingredients and techniques that anyone can master in their
          home kitchen.
        </p>

        <h2>What Makes Us Different</h2>
        <ul>
          <li>
            <strong>Minimalist approach:</strong> Clean, uncluttered recipes
            that focus on what matters
          </li>
          <li>
            <strong>Nutritional transparency:</strong> Clear nutrition
            information for every recipe
          </li>
          <li>
            <strong>Accessibility first:</strong> Recipes designed for all skill
            levels and dietary needs
          </li>
          <li>
            <strong>Beautiful presentation:</strong> Food that nourishes both
            body and soul
          </li>
        </ul>

        <h2>Get in Touch</h2>
        <p>
          Have a question about a recipe or want to share your cooking success?
          We&apos;d love to hear from you at{" "}
          <a
            href="mailto:hello@sageandoat.com"
            className="text-primary hover:underline"
          >
            hello@sageandoat.com
          </a>
        </p>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Recipe Development
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-0">
            All recipes are tested multiple times in home kitchens to ensure
            they work perfectly for you. We believe in real food for real
            people, made with love and attention to detail.
          </p>
        </div>
      </div>
    </div>
  );
}
