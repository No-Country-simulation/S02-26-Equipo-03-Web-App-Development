"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ScalarPage() {
  return (
    <SwaggerUI
      url="/api/scalar"
      defaultModelsExpandDepth={1}
      docExpansion="list"
    />
  );
}
