import numpy as np
import psycopg2
from decouple import config
from sklearn.metrics.pairwise import cosine_similarity

def generate_recommendations():
    # Conexión a la base de datos
    conn = psycopg2.connect(
        host=config('PGSQL_HOST'),
        user=config('PGSQL_USER'),
        password=config('PGSQL_PASSWORD'),
        database=config('PGSQL_DATABASE')
    )

    # Consulta SQL para obtener las calificaciones
    sql = "SELECT usuario_id, sitios_id, calificacion FROM calificaciones"
    cursor = conn.cursor()
    cursor.execute(sql)
    rows = cursor.fetchall()

    # Obtener el número de usuarios y sitios
    num_users = max([row[0] for row in rows])
    num_sites = max([row[1] for row in rows])

    # Crear matriz de calificaciones
    ratings_matrix = np.zeros((num_users, num_sites))

    for row in rows:
        user_id = row[0]
        site_id = row[1]
        rating = row[2]
        ratings_matrix[user_id - 1][site_id - 1] = rating

    # Calcular la similitud de coseno entre usuarios
    similarity_matrix = cosine_similarity(ratings_matrix)

    # Generar recomendaciones para cada usuario
    user_recommendations = {}

    for user_id in range(num_users):
        user_ratings = ratings_matrix[user_id]
        similar_users = similarity_matrix[user_id]

        # Obtener los usuarios más similares
        similar_indices = np.argsort(similar_users)[::-1][1:]  # Excluir al usuario actual

        # Calcular las recomendaciones para el usuario
        recommendations = []
        for site_id in range(num_sites):
            if user_ratings[site_id] == 0:  # El usuario no ha calificado el sitio
                site_ratings = ratings_matrix[:, site_id]
                site_scores = site_ratings[similar_indices]
                avg_score = np.mean(site_scores)
                recommendations.append((site_id + 1, avg_score))

        # Ordenar las recomendaciones por puntaje promedio
        recommendations.sort(key=lambda x: x[1], reverse=True)

        # Agregar las 5 mejores recomendaciones al diccionario
        user_recommendations[user_id + 1] = recommendations[:5]

    return user_recommendations