import React, { useState } from 'react';
import { Button, Card, Input } from '../ui/modern';

const DesignSystem = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');
  const [inputSuccess, setInputSuccess] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length < 3) {
      setInputError('Input must be at least 3 characters');
      setInputSuccess('');
    } else if (value.length > 10) {
      setInputError('Input must be less than 10 characters');
      setInputSuccess('');
    } else {
      setInputError('');
      setInputSuccess('Input is valid!');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="h1 text-primary">Modern Design System</h1>
        <p className="text-lg text-neutral-600">
          A comprehensive design system with modern typography, spacing, and components
        </p>
      </div>

      {/* Typography Section */}
      <section className="mb-12">
        <h2 className="h2">Typography</h2>
        <Card className="mb-6">
          <Card.Content>
            <h1 className="h1">Heading 1 - Main Title</h1>
            <h2 className="h2">Heading 2 - Section Title</h2>
            <h3 className="h3">Heading 3 - Subsection</h3>
            <h4 className="h4">Heading 4 - Card Title</h4>
            <h5 className="h5">Heading 5 - Small Title</h5>
            <h6 className="h6">Heading 6 - Tiny Title</h6>
            
            <div className="property-divider"></div>
            
            <p className="text-base">Base text - This is the standard body text size.</p>
            <p className="text-sm">Small text - Used for captions and secondary information.</p>
            <p className="text-xs">Extra small text - Used for labels and metadata.</p>
          </Card.Content>
        </Card>
      </section>

      {/* Color System Section */}
      <section className="mb-12">
        <h2 className="h2">Color System</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <Card.Content className="text-center">
              <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-neutral-500">#2563eb</p>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Content className="text-center">
              <div className="w-16 h-16 bg-accent-green rounded-lg mx-auto mb-2"></div>
              <p className="text-sm font-medium">Success</p>
              <p className="text-xs text-neutral-500">#10b981</p>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Content className="text-center">
              <div className="w-16 h-16 bg-accent-yellow rounded-lg mx-auto mb-2"></div>
              <p className="text-sm font-medium">Warning</p>
              <p className="text-xs text-neutral-500">#f59e0b</p>
            </Card.Content>
          </Card>
          
          <Card>
            <Card.Content className="text-center">
              <div className="w-16 h-16 bg-accent-red rounded-lg mx-auto mb-2"></div>
              <p className="text-sm font-medium">Error</p>
              <p className="text-xs text-neutral-500">#ef4444</p>
            </Card.Content>
          </Card>
        </div>
      </section>

      {/* Button Section */}
      <section className="mb-12">
        <h2 className="h2">Buttons</h2>
        <Card className="mb-6">
          <Card.Content>
            <h3 className="h3 mb-4">Button Variants</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
            </div>

            <h3 className="h3 mb-4">Button Sizes</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <Button size="sm">Small</Button>
              <Button size="base">Base</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>

            <h3 className="h3 mb-4">Button States</h3>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled</Button>
              <Button loading>Loading</Button>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Card Section */}
      <section className="mb-12">
        <h2 className="h2">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <Card.Header>
              <Card.Title>Default Card</Card.Title>
              <Card.Subtitle>This is a subtitle for the card</Card.Subtitle>
            </Card.Header>
            <Card.Content>
              <p>This is the main content of the card. It can contain any type of content including text, images, forms, etc.</p>
            </Card.Content>
            <Card.Footer>
              <Button size="sm">Action</Button>
              <span className="text-sm text-neutral-500">Footer content</span>
            </Card.Footer>
          </Card>

          <Card variant="elevated">
            <Card.Header>
              <Card.Title>Elevated Card</Card.Title>
              <Card.Subtitle>With enhanced shadow and hover effects</Card.Subtitle>
            </Card.Header>
            <Card.Content>
              <p>This card has an elevated appearance with stronger shadows and more pronounced hover effects.</p>
            </Card.Content>
            <Card.Footer>
              <Button size="sm" variant="outline">Cancel</Button>
              <Button size="sm">Confirm</Button>
            </Card.Footer>
          </Card>
        </div>

        <Card variant="outlined" className="mb-6">
          <Card.Content>
            <h3 className="h3">Outlined Card</h3>
            <p>This card uses an outlined style with a border that changes color on hover.</p>
          </Card.Content>
        </Card>

        <Card variant="ghost" className="mb-6">
          <Card.Content>
            <h3 className="h3">Ghost Card</h3>
            <p>This card has a transparent background and subtle hover effects.</p>
          </Card.Content>
        </Card>
      </section>

      {/* Input Section */}
      <section className="mb-12">
        <h2 className="h2">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <Card.Content>
              <h3 className="h3 mb-4">Input Variants</h3>
              <Input
                label="Default Input"
                placeholder="Enter text here..."
                className="mb-4"
              />
              
              <Input
                label="Outlined Input"
                variant="outlined"
                placeholder="Outlined style..."
                className="mb-4"
              />
              
              <Input
                label="Filled Input"
                variant="filled"
                placeholder="Filled style..."
                className="mb-4"
              />
            </Card.Content>
          </Card>

          <Card>
            <Card.Content>
              <h3 className="h3 mb-4">Input States</h3>
              <Input
                label="Error Input"
                value={inputValue}
                onChange={handleInputChange}
                error={inputError}
                helpText={inputError}
                className="mb-4"
              />
              
              <Input
                label="Success Input"
                value={inputValue}
                onChange={handleInputChange}
                success={inputSuccess}
                helpText={inputSuccess}
                className="mb-4"
              />
              
              <Input
                label="Disabled Input"
                placeholder="This input is disabled"
                disabled
                className="mb-4"
              />
            </Card.Content>
          </Card>
        </div>

        <Card className="mb-6">
          <Card.Content>
            <h3 className="h3 mb-4">Input Sizes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Small Input"
                size="sm"
                placeholder="Small size..."
              />
              
              <Input
                label="Base Input"
                size="base"
                placeholder="Base size..."
              />
              
              <Input
                label="Large Input"
                size="lg"
                placeholder="Large size..."
              />
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Property Listing Example */}
      <section className="mb-12">
        <h2 className="h2">Property Listing Example</h2>
        <Card variant="elevated">
          <Card.Content>
            <h1 className="property-highlight">Spacious | Investor Deal | Smart Home</h1>
            <p className="property-location">📍 Jumeirah Village Circle, Helvetia Residences</p>
            
            <div className="property-divider"></div>
            
            <h2 className="property-price">AED 955,000</h2>
            
            <div className="property-divider"></div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="property-details">
                <strong>Type:</strong> APARTMENT
              </div>
              <div className="property-details">
                🛏️ <strong>Studio</strong>
              </div>
              <div className="property-details">
                📐 <strong>425.17 sq.ft</strong>
              </div>
              <div className="property-details">
                🏘️ <strong>Jumeirah Village Circle</strong>
              </div>
            </div>
          </Card.Content>
        </Card>
      </section>

      {/* Spacing Utilities */}
      <section className="mb-12">
        <h2 className="h2">Spacing Utilities</h2>
        <Card>
          <Card.Content>
            <div className="space-y-4">
              <div className="p-1 bg-neutral-200 text-xs">Padding 1 (4px)</div>
              <div className="p-2 bg-neutral-200 text-xs">Padding 2 (8px)</div>
              <div className="p-3 bg-neutral-200 text-xs">Padding 3 (12px)</div>
              <div className="p-4 bg-neutral-200 text-xs">Padding 4 (16px)</div>
              <div className="p-6 bg-neutral-200 text-xs">Padding 6 (24px)</div>
              <div className="p-8 bg-neutral-200 text-xs">Padding 8 (32px)</div>
            </div>
          </Card.Content>
        </Card>
      </section>
    </div>
  );
};

export default DesignSystem;
