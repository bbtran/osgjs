( function () {
    'use strict';

    var osgShader = window.OSG.osgShader;
    var osg = window.OSG.osg;


    // this compiler use basic lighting and add a node to demonstrate how to
    // customize the shader compiler
    var CustomCompiler = function () {
        osgShader.Compiler.apply( this, arguments );
    };

    CustomCompiler.validAttributeTypeMember = osgShader.Compiler.validAttributeTypeMember.slice( 0 );
    CustomCompiler.validAttributeTypeMember.push( 'Ramp' );
    CustomCompiler.validAttributeTypeMember.push( 'Negatif' );
    CustomCompiler.validAttributeTypeMember.forEach( osg.getOrCreateStateAttributeTypeMemberIndexFromName );

    CustomCompiler.supportLibraryName = osgShader.Compiler.supportLibraryName;

    CustomCompiler.prototype = osg.objectInherit( osgShader.Compiler.prototype, {

        createLighting: function () {
            // we simply hook the createLighting function and apply our ramp and negatif attributes
            var lightOutput = osgShader.Compiler.prototype.createLighting.call( this );

            // ======================================================
            // my custom attribute ramp
            // it's here I connect ouput of light result with my ramp
            // ======================================================
            var rampAttribute = this.getAttributeType( 'Ramp' );
            if ( rampAttribute && rampAttribute.getAttributeEnable() ) {
                var rampResult = this.createVariable( 'vec3' );
                this.getNode( 'Ramp' ).inputs( {
                    color: lightOutput
                } ).outputs( {
                    color: rampResult
                } );
                lightOutput = rampResult;
            }

            // ======================================================
            // my custom attribute negatif
            // it's here I connect ouput of light result with my ramp
            // ======================================================
            var negatifAttribute = this.getAttributeType( 'Negatif' );
            if ( negatifAttribute ) {
                var negatifResult = this.createVariable( 'vec3' );
                this.getNode( 'Negatif' ).inputs( {
                    color: lightOutput,
                    enable: this.getOrCreateUniform( negatifAttribute.getOrCreateUniforms().enable )
                } ).outputs( {
                    color: negatifResult
                } );
                lightOutput = negatifResult;
            }

            return lightOutput;
        }

    } );

    window.CustomCompiler = CustomCompiler;

} )();
