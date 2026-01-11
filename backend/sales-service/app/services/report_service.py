from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from datetime import datetime
from io import BytesIO
from sqlalchemy.orm import Session
from fastapi import Depends
from app.database import get_db
from app.repositories import sale_repository
from app.schemas.sale import SaleCreate, SaleResponse, SaleRead

class ReportService:

    def __init__(self, db: Session):
        self.db = db

    def generate_sales_report(self, date_from, date_to):

        try:
            filters = {
                "date_from": date_from,
                "date_to": date_to
            }

            sales_data = sale_repository.list_sales(self.db, filters, page=1, size=1000)

            sales = sales_data.get("sales")

            if not sales:
                raise ValueError("No sales found for the given date range")

            total_amount = sum(s.total_amount for s in sales)
            total_sales = len(sales)

            totals_by_payment = {}
            for s in sales:
                pm = s.payment_method
                totals_by_payment[pm] = totals_by_payment.get(pm, 0) + s.total_amount

            #PDF Generation
            buffer = BytesIO()
            pdf = canvas.Canvas(buffer, pagesize=letter)

            pdf.setTitle("Reporte de ventas")

            y = 750
            pdf.drawString(50, y, f"Reporte de ventas desde {date_from} hasta {date_to}")
            y -= 30
            pdf.drawString(50, y, f"Total de ventas: {total_sales}")
            y -= 20
            pdf.drawString(50, y, f"Monto total: ${total_amount:.2f}")
            y -= 30
            pdf.drawString(50, y, "Totales por método de pago:")
            y -= 20
            for method, amount in totals_by_payment.items():
                pdf.drawString(70, y, f"{method}: ${amount:.2f}")
                y -= 20
            
            y -= 30
            pdf.drawString(50, y, "Sales detail:")
            y -= 20

            for s in sales:
                if y < 50:
                    pdf.showPage()
                    y = 750

                pdf.drawString(
                    50,
                    y,
                    f"Sale #{s.id} | {s.created_at} | {s.payment_method} | {s.total_amount:.2f}"
                )
                y -= 15

            pdf.save()
            buffer.seek(0)

            return buffer
        except (ValueError, ConnectionError) as e:
            raise e
        except Exception as e:
            raise Exception("Failed to generate sales report") from e

def get_report_service(db: Session = Depends(get_db)):
    return ReportService(db)