import { useState } from 'react';
import { Button, Card } from '../components';

const ExamplePage = () => {
  const [notification, setNotification] = useState('');

  const handleButtonClick = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Contoh Komponen Tailwind CSS
        </h1>

        {notification && (
          <div className="mb-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-bounce">
            {notification}
          </div>
        )}

        {/* Buttons Section */}
        <Card title="Button Components" className="mb-8">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => handleButtonClick('Primary button clicked!')}>
                Primary
              </Button>
              <Button variant="secondary" onClick={() => handleButtonClick('Secondary button clicked!')}>
                Secondary
              </Button>
              <Button variant="success" onClick={() => handleButtonClick('Success button clicked!')}>
                Success
              </Button>
              <Button variant="danger" onClick={() => handleButtonClick('Danger button clicked!')}>
                Danger
              </Button>
              <Button variant="outline" onClick={() => handleButtonClick('Outline button clicked!')}>
                Outline
              </Button>
            </div>

            <div className="flex flex-wrap gap-4 items-end">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>
        </Card>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card title="Card 1">
            <p className="text-gray-600 dark:text-gray-300">
              Ini adalah contoh card dengan Tailwind CSS. Card ini responsive dan memiliki dark mode support.
            </p>
          </Card>

          <Card 
            title="Card dengan Footer"
            footer={
              <Button size="sm" className="w-full">
                Action Button
              </Button>
            }
          >
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Card ini memiliki footer dengan button di dalamnya.
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </Card>

          <Card title="Stats Card">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Users</span>
                <span className="text-2xl font-bold text-blue-600">1,234</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Revenue</span>
                <span className="text-2xl font-bold text-green-600">$12.5K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-300">Growth</span>
                <span className="text-2xl font-bold text-purple-600">+23%</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Example */}
        <Card title="Form Example">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <Button type="submit" className="w-full">
              Submit Form
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ExamplePage;
