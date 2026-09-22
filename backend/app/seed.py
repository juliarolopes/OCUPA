import asyncio
import re
import unicodedata
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pwdlib import PasswordHash

from app.core.database import SessionLocal
from app.models import Amenity, PriceUnit, Purpose, Space, User


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", normalized.lower()).strip("-")


PURPOSE_NAMES = [
    "Armazenar", "Trabalhar", "Fotografar", "Criar", "Guardar", "Produzir", "Ensinar", "Outros"
]
AMENITY_NAMES = [
    "Coberta", "Acesso fácil", "Energia", "Wi-Fi", "Mesa de trabalho", "Fechado",
    "Iluminação", "Fundo fotográfico", "Bancada", "Ferramentas", "Ventilação", "Área externa",
]
SPACE_DATA = [
    ("Garagem Central", "Garagem", 18, 4, "Vila Mariana", -23.5897, -46.6348, 15, "dia", ["Armazenar", "Guardar", "Produzir"], ["Coberta", "Acesso fácil", "Energia"], "Garagem seca, segura e de acesso simples, ideal para guardar móveis e equipamentos."),
    ("Sala Criativa", "Sala", 24, 6, "Pinheiros", -23.5675, -46.6917, 20, "hora", ["Trabalhar", "Fotografar", "Criar", "Ensinar"], ["Wi-Fi", "Energia", "Mesa de trabalho"], "Ambiente versátil e iluminado, ideal para reuniões, aulas e trabalhos criativos."),
    ("Depósito 42", "Depósito", 12, 3, "Mooca", -23.5608, -46.5905, 12, "dia", ["Armazenar", "Guardar"], ["Energia", "Acesso fácil", "Fechado"], "Depósito compacto no térreo, com acesso direto e prateleiras modulares."),
    ("Estúdio Luz", "Estúdio", 35, 8, "Liberdade", -23.5613, -46.6358, 35, "hora", ["Fotografar", "Criar", "Produzir"], ["Wi-Fi", "Iluminação", "Energia", "Fundo fotográfico"], "Estúdio de pé-direito alto com luz natural controlável para pequenas produções."),
    ("Oficina Verde", "Oficina", 28, 5, "Saúde", -23.6126, -46.6297, 25, "hora", ["Criar", "Produzir", "Trabalhar"], ["Energia", "Bancada", "Ferramentas", "Ventilação"], "Oficina arejada para protótipos, reparos e marcenaria leve."),
    ("Quintal das Árvores", "Quintal", 45, 20, "Lapa", -23.5275, -46.7057, 30, "dia", ["Fotografar", "Criar", "Ensinar", "Produzir"], ["Coberta", "Área externa", "Energia"], "Quintal arborizado e reservado para encontros, aulas e pequenas produções."),
]
password_hasher = PasswordHash.recommended()


async def get_or_create_named(session: AsyncSession, model: type[Purpose] | type[Amenity], names: list[str]):
    existing = {item.slug: item for item in (await session.scalars(select(model))).all()}
    result = {}
    for name in names:
        slug = slugify(name)
        item = existing.get(slug) or model(name=name, slug=slug)
        session.add(item)
        result[name] = item
    await session.flush()
    return result


async def seed() -> None:
    async with SessionLocal() as session:
        owner = await session.scalar(select(User).where(User.email == "ana@ocupa.local"))
        if owner is None:
            owner = User(
                name="Ana Oliveira",
                email="ana@ocupa.local",
                password_hash=password_hasher.hash("ocupa-demo-123"),
            )
            session.add(owner)
            session.add(
                User(
                    name="Bruno Santos",
                    email="bruno@ocupa.local",
                    password_hash=password_hasher.hash("ocupa-demo-123"),
                )
            )
            await session.flush()
        elif owner.password_hash == "seed-not-for-login":
            owner.password_hash = password_hasher.hash("ocupa-demo-123")
        purposes = await get_or_create_named(session, Purpose, PURPOSE_NAMES)
        amenities = await get_or_create_named(session, Amenity, AMENITY_NAMES)
        existing_names = set(await session.scalars(select(Space.name)))
        for index, data in enumerate(SPACE_DATA, start=1):
            name, space_type, area, capacity, neighborhood, lat, lon, price, unit, purpose_names, amenity_names, description = data
            if name in existing_names:
                continue
            session.add(Space(
                owner=owner, name=name, type=space_type, description=description,
                area=Decimal(area), capacity=capacity, address=f"Rua Exemplo, {index * 10}",
                neighborhood=neighborhood, city="São Paulo", state="SP", latitude=lat,
                longitude=lon, price_value=Decimal(price), price_unit=PriceUnit(unit),
                purposes=[purposes[item] for item in purpose_names],
                amenities=[amenities[item] for item in amenity_names],
            ))
        await session.commit()
    print("Development data seeded successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
