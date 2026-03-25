import React from 'react';

// Official contact details

export const Contact = () => {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto max-w-2xl px-4">
        <h1 className="text-3xl font-bold mb-4">
          Contact <span className="text-primary">Ardhana Capital</span>
        </h1>

        <div className="bg-card border rounded-md p-6 space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="text-lg font-medium">
              rooast77@gmail.com
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Phone</div>
            <div className="text-lg font-medium">
              085921998239
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Office</div>
            <div className="text-lg font-medium">
              Home Office
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Hours</div>
            <div className="text-lg font-medium">
              24/7
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
