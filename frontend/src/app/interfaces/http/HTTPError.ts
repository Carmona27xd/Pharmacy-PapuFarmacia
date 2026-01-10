export interface InterfaceHTTPValidationError {
  detail: InterfaceDetailItem[];
}

interface InterfaceDetailItem {
  loc: (string | number)[];
  // Array de strings o números (e.g., ["body", "username"] o ["query", 0])
  msg: string;
  // Mensaje de error (e.g., "field required")
  type: string;
  // Tipo de error (e.g., "missing" o "value_error")
}
