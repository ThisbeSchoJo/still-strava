"""Add Comment model, add in relationships in Activity and User models

Revision ID: 2e129c3fc412
Revises: 3552fcebc406
Create Date: 2025-06-12 22:08:53.098214

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2e129c3fc412'
down_revision = '3552fcebc406'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('comments',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('content', sa.String(), nullable=True),
    sa.Column('datetime', sa.DateTime(), nullable=True),
    sa.Column('activity_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['activity_id'], ['activities.id'], name=op.f('fk_comments_activity_id_activities')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_comments_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('activities', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_activities_user_id_users'), 'users', ['user_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('activities', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_activities_user_id_users'), type_='foreignkey')
        batch_op.drop_column('user_id')

    op.drop_table('comments')
    # ### end Alembic commands ###
