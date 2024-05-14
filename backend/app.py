from flask import Flask, jsonify, redirect, request, url_for
from flask_login import current_user, login_required, logout_user
from config import config
from flask_cors import CORS
from database import get_connection
import psycopg2
import psycopg2.extras
from recommender import generate_recommendations

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

conn=get_connection()

@app.route('/login', methods=['POST'])
def login():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    _json = request.json
    _email= _json['email']
    _password = _json['password']

    print(_password)
    # validacion
    if _email and _password:
        # Confirmación de existencia del usuario
        
        sql = "SELECT * FROM public.usuarios WHERE correo=%s"
        sql_where = (_email,)

        cursor.execute(sql, sql_where)
        row = cursor.fetchone()
        if row == None:
            resp = jsonify({'message': 'Bad Request - invalid credendtial or user dont exist'})
            resp.status_code = 400
            return resp 
        else:
            email = row['correo']
        print(email)
        password = row['password']
        username= row['nombre']
        user_id= row['id']
        print(email)
        print(password)
        if row:
            if password == _password:
                cursor.close()
                return jsonify({'message': 'You are logged in successfully','user':username, 'id':user_id})
            else:
                resp = jsonify(
                    {'message': 'Bad Request - invalid credendtials'})
                resp.status_code = 400
                return resp
        else:
            resp = jsonify({'message': 'Bad Request - invalid credendtial or user dont exist'})
            resp.status_code = 400
            return resp
    else:
        resp = jsonify({'message': 'Bad Request - invalid credendtial or user dont exist'})
        resp.status_code = 400
        return resp

# solucionamos cors  en /sigin para que no de error:

@app.route('/signin', methods=['POST'])
def signin():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    _json = request.json
    _email= _json['email']
    _password = _json['password']
    _name = _json['name']
    print(_password)
    # validacion
    if _email:
        # Confirmación de existencia del correo
        sql_select= "SELECT * FROM public.usuarios WHERE correo=%s"
        sql_where = (_email,)
        cursor.execute(sql_select, sql_where)
        row = cursor.fetchone()
        if row == None:
            cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            sql = "INSERT INTO public.usuarios (nombre, correo, password) VALUES (%s, %s, %s)"
            sql_where = (_name, _email, _password)
            cursor.execute(sql, sql_where)
            conn.commit()
            cursor.close()
            return redirect(url_for('index'))      
        else:
           resp = jsonify({'message': 'Bad Request - User already exists'})
           resp.status_code = 400
           return resp
    else:
        resp = jsonify({'message': 'Bad Request - None Data'})
        resp.status_code = 400
        return resp


@app.route('/signup', methods=['POST'])
def signup():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    _json = request.json
    _email = _json['email']
    _password = _json['password']
    _name = _json['name']

    # Validación
    if _email:
        # Confirmación de existencia del correo
        sql_select = "SELECT * FROM public.usuarios WHERE correo = %s"
        sql_where = (_email,)
        cursor.execute(sql_select, sql_where)
        row = cursor.fetchone()
        if row is None:
            cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            sql = "INSERT INTO public.usuarios (nombre, correo, password) VALUES (%s, %s, %s)"
            sql_values = (_name, _email, _password)
            cursor.execute(sql, sql_values)
            conn.commit()
            cursor.close()
            resp = jsonify({'message': 'Welcome new user'})
            return resp

        else:
            resp = jsonify({'message': 'Bad Request - User already exists'})
            resp.status_code = 400
            return resp
    else:
        resp = jsonify({'message': 'Bad Request - None Data'})
        resp.status_code = 400
        return resp


#Aquí es de donde se obtienen los 5 sitios mejor valorados   
@app.route('/main', methods=['GET'])
def get_top_sites():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = "SELECT * FROM sitios ORDER BY rating_promedio DESC LIMIT 5"
    cursor.execute(sql)
    top_sites = cursor.fetchall()
    cursor.close()
    return jsonify(top_sites)



@app.route('/sitios/<int:site_id>', methods=['GET'])
def get_site(site_id):
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = "SELECT * FROM sitios WHERE id = %s"
    sql_values = (site_id,)
    cursor.execute(sql, sql_values)
    site = cursor.fetchone()
    cursor.close()

    if site is None:
        return jsonify({'message': 'Sitio no encontrado'}), 404

    return jsonify(site)

@app.route('/sitios/<int:site_id>/calificar', methods=['POST'])
#@login_required
def rate_site(site_id):
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    _json = request.json
    _user_id = _json['user_id']
    _rating = _json['rating']

    # Guardar calificación en la base de datos
    sql= "INSERT INTO calificaciones (sitios_id, usuario_id, calificacion) VALUES (%s, %s, %s)"
    sql_values = (site_id, _user_id, _rating)
    cursor.execute(sql, sql_values)
    conn.commit()

    # Actualizar el rating promedio del sitio
    sql = "SELECT AVG(calificacion) FROM calificaciones WHERE sitios_id = %s"
    sql_where = (site_id,)
    cursor.execute(sql, sql_where)
    avg_rating = cursor.fetchone()[0]

    sql = "UPDATE sitios SET rating_promedio = %s WHERE id = %s"
    sql_values = (avg_rating, site_id)
    cursor.execute(sql, sql_values)
    conn.commit()

    cursor.close()
    return jsonify({'message': 'Rating saved successfully'})

@app.route('/sitios', methods=['GET'])
def get_all_sites():
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sort_by = request.args.get('sort_by')  # Parámetro opcional para ordenar
    category = request.args.get('category')  # Parámetro opcional para filtrar por categoría

    if sort_by == 'rating':
        sql = "SELECT * FROM sitios ORDER BY rating_promedio DESC"
    else:
        sql = "SELECT * FROM sitios ORDER BY id ASC"

    if category:
        sql += " WHERE categorias LIKE %s"
        category_filter = f"%{category}%"
        cursor.execute(sql, (category_filter,))
    else:
        cursor.execute(sql)

    sites = cursor.fetchall()
    cursor.close()
    return jsonify(sites)



@app.route('/usuario/<int:user_id>/calificaciones', methods=['GET'])
#@login_required
def get_user_ratings(user_id):
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    sql = "SELECT sitios.*, calificaciones.calificacion FROM sitios JOIN calificaciones ON sitios.id = calificaciones.sitios_id WHERE calificaciones.usuario_id = %s"
    sql_values = (user_id,)
    cursor.execute(sql, sql_values)
    ratings = cursor.fetchall()
    cursor.close()

    # Separar las categorías y convertirlas en listas para cada sitio
    for rating in ratings:
        categories = rating['categorias'].split('|')
        rating['categorias'] = categories

    if len(ratings) == 0:
        return jsonify({'message': 'No se encontraron calificaciones para este usuario'})

    return jsonify(ratings)



@app.route('/usuario/<int:user_id>/recomendaciones', methods=['GET'])
#@login_required
def get_user_recommendations(user_id):
    # Generar las recomendaciones para el usuario
    recommendations = generate_recommendations()

    # Obtener las recomendaciones para el usuario específico
    user_recommendations = recommendations.get(user_id, [])

    # Obtener la información de los sitios recomendados
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    recommended_sites = []

    for site_id, _ in user_recommendations:
        sql = "SELECT * FROM sitios WHERE id = %s"
        sql_values = (site_id,)
        cursor.execute(sql, sql_values)
        site = cursor.fetchone()
        if site:
            recommended_sites.append(site)

    cursor.close()

    return jsonify(recommended_sites)
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))



if __name__== '__main__':
    app.config.from_object(config['development'])
    app.run()

