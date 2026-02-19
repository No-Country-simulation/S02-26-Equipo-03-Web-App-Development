"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function SwaggerUiPage() {
  return (
    <SwaggerUI
      url="/api/swagger-ui"
      defaultModelsExpandDepth={1}
      docExpansion="list"
    />
  );
}
