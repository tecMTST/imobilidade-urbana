using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LightToggle : MonoBehaviour
{
    public UnityEngine.Rendering.Universal.Light2D light2D; 
    public UnityEngine.Rendering.Universal.Light2D light2D2; 
    private Button button;

    private void Start()
    {
        button = GetComponent<Button>();
        button.onClick.AddListener(ToggleLight);
    }

    private void ToggleLight()
    {
        light2D.enabled = !light2D.enabled;
        light2D2.enabled = !light2D2.enabled;
    }
}
