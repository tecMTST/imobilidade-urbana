using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LightToggle : MonoBehaviour
{
    public UnityEngine.Rendering.Universal.Light2D light2D;
    public UnityEngine.Rendering.Universal.Light2D light2D2; 
    
    public Image lanternToggle;
    public Sprite imageOff;
    public Sprite imageOn;

    //Lista de SFX:
    [SerializeField] private AudioClip sfxLight;

    private void Start()
    {
    


        
    }

    public void ToggleLight(bool active)
    {
        //light2D.enabled = !light2D.enabled;
        light2D.gameObject.SetActive(active);
        light2D2.gameObject.SetActive(active);
        SoundManager.instance.playMenuSFX((int)SoundManager.ListaSFX.menuLuz);
        
        if(active) {
            lanternToggle.sprite = imageOn;
        } else {
            lanternToggle.sprite = imageOff;
        }
        

        if (!active) {
            SoundManager.instance.stopDinamicBGM();
        }

    }
}
