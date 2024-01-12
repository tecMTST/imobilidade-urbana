using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GlitchController : MonoBehaviour
{
    public Material glitchMat;
    public float noiseAmount;
    public float glitchStrength;
    public float scanLinesStrength;


    void Awake()
    {
        glitchMat.SetFloat("_NoiseAmount", 0);
        glitchMat.SetFloat("_GlitchStrength", 0);
        glitchMat.SetFloat("_ScanlinesStrength", 1);
    }

    void Update()
    {
        glitchMat.SetFloat("_NoiseAmount", noiseAmount);
        glitchMat.SetFloat("_GlitchStrength", glitchStrength);
        glitchMat.SetFloat("_ScanlinesStrength", scanLinesStrength);
    }
}
