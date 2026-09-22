"""Create the initial OCUPA domain schema.

Revision ID: 20260922_0001
Revises:
Create Date: 2026-09-22
"""
from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa

revision: str = "20260922_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

price_unit = sa.Enum("hora", "dia", name="price_unit")
reservation_status = sa.Enum("pending", "confirmed", "cancelled", name="reservation_status")


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id", name="pk_users"),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_email", "users", ["email"])

    for table_name in ("purposes", "amenities"):
        op.create_table(
            table_name,
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("name", sa.String(80), nullable=False),
            sa.Column("slug", sa.String(80), nullable=False),
            sa.PrimaryKeyConstraint("id", name=f"pk_{table_name}"),
            sa.UniqueConstraint("name", name=f"uq_{table_name}_name"),
            sa.UniqueConstraint("slug", name=f"uq_{table_name}_slug"),
        )
        op.create_index(f"ix_{table_name}_slug", table_name, ["slug"])

    op.create_table(
        "spaces",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(160), nullable=False),
        sa.Column("type", sa.String(80), nullable=False),
        sa.Column("description", sa.String(), nullable=False),
        sa.Column("area", sa.Numeric(10, 2), nullable=False),
        sa.Column("capacity", sa.Integer(), nullable=False),
        sa.Column("address", sa.String(255), nullable=False),
        sa.Column("neighborhood", sa.String(120), nullable=False),
        sa.Column("city", sa.String(120), nullable=False),
        sa.Column("state", sa.String(2), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=False),
        sa.Column("longitude", sa.Float(), nullable=False),
        sa.Column("price_value", sa.Numeric(10, 2), nullable=False),
        sa.Column("price_unit", price_unit, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("area > 0", name="ck_spaces_area_positive"),
        sa.CheckConstraint("capacity > 0", name="ck_spaces_capacity_positive"),
        sa.CheckConstraint("price_value >= 0", name="ck_spaces_price_non_negative"),
        sa.CheckConstraint("latitude BETWEEN -90 AND 90", name="ck_spaces_latitude_range"),
        sa.CheckConstraint("longitude BETWEEN -180 AND 180", name="ck_spaces_longitude_range"),
        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], name="fk_spaces_owner_id_users", ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name="pk_spaces"),
    )
    for column in ("owner_id", "type", "neighborhood", "city", "state"):
        op.create_index(f"ix_spaces_{column}", "spaces", [column])

    op.create_table(
        "space_purposes",
        sa.Column("space_id", sa.Integer(), nullable=False),
        sa.Column("purpose_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["purpose_id"], ["purposes.id"], name="fk_space_purposes_purpose_id_purposes", ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["space_id"], ["spaces.id"], name="fk_space_purposes_space_id_spaces", ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("space_id", "purpose_id", name="pk_space_purposes"),
    )
    op.create_table(
        "space_amenities",
        sa.Column("space_id", sa.Integer(), nullable=False),
        sa.Column("amenity_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["amenity_id"], ["amenities.id"], name="fk_space_amenities_amenity_id_amenities", ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["space_id"], ["spaces.id"], name="fk_space_amenities_space_id_spaces", ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("space_id", "amenity_id", name="pk_space_amenities"),
    )
    op.create_table(
        "favorites",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("space_id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["space_id"], ["spaces.id"], name="fk_favorites_space_id_spaces", ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_favorites_user_id_users", ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("user_id", "space_id", name="pk_favorites"),
        sa.UniqueConstraint("user_id", "space_id", name="uq_favorites_user_space"),
    )
    op.create_table(
        "reservations",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("space_id", sa.Integer(), nullable=False),
        sa.Column("start_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("end_datetime", sa.DateTime(timezone=True), nullable=False),
        sa.Column("status", reservation_status, server_default="pending", nullable=False),
        sa.Column("total_price", sa.Numeric(10, 2), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.CheckConstraint("end_datetime > start_datetime", name="ck_reservations_valid_period"),
        sa.CheckConstraint("total_price >= 0", name="ck_reservations_total_price_non_negative"),
        sa.ForeignKeyConstraint(["space_id"], ["spaces.id"], name="fk_reservations_space_id_spaces", ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], name="fk_reservations_user_id_users", ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id", name="pk_reservations"),
    )
    for column in ("user_id", "space_id", "start_datetime", "end_datetime", "status"):
        op.create_index(f"ix_reservations_{column}", "reservations", [column])


def downgrade() -> None:
    op.drop_table("reservations")
    op.drop_table("favorites")
    op.drop_table("space_amenities")
    op.drop_table("space_purposes")
    op.drop_table("spaces")
    op.drop_table("amenities")
    op.drop_table("purposes")
    op.drop_table("users")
    reservation_status.drop(op.get_bind(), checkfirst=True)
    price_unit.drop(op.get_bind(), checkfirst=True)
