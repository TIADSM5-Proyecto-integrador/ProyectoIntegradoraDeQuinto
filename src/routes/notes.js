const express = require('express');
const router = express.Router();

const Note = require('../models/Note');
const {isAuthenticated} = require('../helper/auth.js');

router.get('/notes/add', isAuthenticated, (req, res) =>   {
    res.render('notes/new-notes')
});

router.post('/notes/new-notes', isAuthenticated, async (req, res) =>   {
    const { nombre, salario, puesto, seguimiento, gafette } = req.body;
    const errors = [];
    if(!nombre) {
        errors.push({text: 'Favor de incertar el nombre'});
    }
    if(!salario) {
        errors.push({text: 'Favor de incertar el salario esperado'});
    }
    if(!puesto) {
        errors.push({text: 'Favor de incertar el puesto esperado'});
    }
    if(!gafette) {
        errors.push({text: 'Favor de incertar seguimiento del candidato'});
    }
    if(!seguimiento) {
        errors.push({text: 'Favor de incertar seguimiento del candidato'});
    }
    if(errors.length > 0) {
        res.render('notes/new-notes', { 
            errors,
            nombre,
            salario,
            puesto,
            gafette,
            seguimiento

        });
    }else {
            const newNote = new Note({  nombre, salario, puesto, gafette, seguimiento});
            newNote.user = req.user.id;
            await newNote.save();
            req.flash('success_msg', 'Se a agregado al nuevo usuario de manera satisfactoria');
            res.redirect('/notes');
        } 
});

router.get('/notes', isAuthenticated, async (req, res) =>   {
    const notes = await Note.find().lean().sort({date: 'desc'}); //puedes pedirle que te de solo dererminados parametros con un objeto {title: 'param'}
    //lean() para que te lo de como objeto json y sort es el orden
    res.render('notes/all-notes.hbs', { notes });
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) =>   {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-notes', {note});
});

router.put('/notes/edit-notes/:id',isAuthenticated, async (req, res) =>   {
    const {nombre, puesto, salario, gafette, seguimiento} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {nombre, puesto, salario, gafette, seguimiento}).lean();
    req.flash('success_msg', 'Dato actualizado satisfactoriamente');
    res.redirect('/notes'); 
}); 


router.delete('/notes/delete/:id', isAuthenticated, async (req, res) =>   {
    await Note.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'El dato se eliminado satisfactoriamente');
    res.redirect('/notes'); 
});
module.exports = router;