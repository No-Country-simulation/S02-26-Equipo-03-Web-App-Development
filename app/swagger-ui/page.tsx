"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerUiPage() {
  return (
    <div className="swagger-light-shell">
      <SwaggerUI
        url="/api/swagger-ui"
        defaultModelsExpandDepth={1}
        docExpansion="list"
      />
      <style jsx global>{`
        .swagger-light-shell {
          min-height: 100dvh;
          background: #ffffff;
          color: #111827;
        }

        .swagger-light-shell .swagger-ui {
          color: #3b4151;
        }

        .swagger-light-shell .swagger-ui .info p,
        .swagger-light-shell .swagger-ui .info li,
        .swagger-light-shell .swagger-ui .opblock-tag {
          color: #3b4151;
        }
      `}</style>
    </div>
  );
}
