export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} Muhammad Athallah Rizki Putra. All rights reserved.
        </p>
        <p className="text-gray-500 mt-2">
          Built with React & Tailwind CSS. Deployed on AWS.
        </p>
      </div>
    </footer>
  );
}
